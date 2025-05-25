import { ReportsFilter } from '@/components/reports-filter'
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { SearchParams } from '@/types/search-params'
import { formatSearchParams } from '@/utils/format-search-params'
import { FilterIcon } from 'lucide-react'

type ReportsPageProps = {
   searchParams: SearchParams
}

function setDateParamToSearch(startDate: Date | null, endDate: Date | null) {
   return {
      createdAt: {
         ...(startDate ? { gte: startDate } : {}),
         ...(endDate ? { lte: endDate } : {}),
      },
   }
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
   const { startDate, endDate, brand, category } =
      formatSearchParams(searchParams)

   const categories = await prisma.category.findMany()
   const brands = await prisma.brand.findMany()
   const paidOrders = await prisma.order.findMany({
      where: {
         isPaid: true,
         orderItems: {
            every: {
               product: {
                  brand: { title: { equals: brand, mode: 'insensitive' } },
                  categories: {
                     every: {
                        title: { equals: category, mode: 'insensitive' },
                     },
                  },
               },
            },
         },
         ...setDateParamToSearch(startDate, endDate),
      },
      include: {
         orderItems: {
            include: { product: { select: { brand: true, categories: true } } },
         },
      },
   })

   const paidOrdersGroupedByDate = paidOrders.reduce(
      (acc, currentOrder) => {
         const dateIgnoringTime = new Date(currentOrder.createdAt.toJSON())
         dateIgnoringTime.setHours(0, 0, 0, 0)

         return {
            ...acc,
            [dateIgnoringTime.toJSON()]: [
               ...(Array.isArray(acc[dateIgnoringTime.toJSON()])
                  ? acc[dateIgnoringTime.toJSON()]
                  : []),
               currentOrder,
            ],
         }
      },
      {} as Record<string, typeof paidOrders>
   )

   const distinctOrderItems = await prisma.orderItem.findMany({
      distinct: ['productId'],
      where: {
         product: {
            ...(category
               ? {
                    categories: {
                       every: {
                          title: { equals: category, mode: 'insensitive' },
                       },
                    },
                 }
               : {}),

            ...(brand
               ? { brand: { title: { equals: brand, mode: 'insensitive' } } }
               : {}),
         },
         order: { ...setDateParamToSearch(startDate, endDate), isPaid: true },
      },
      include: {
         order: { select: { createdAt: true } },
         product: { select: { title: true, brand: true, categories: true } },
      },
   })

   console.log('distinct orders ', distinctOrderItems)

   const orderItemsCount = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
         count: true,
      },
      orderBy: { _count: { count: 'desc' } },
   })

   const orderItemsSortedByCount = orderItemsCount
      .filter(
         (orderItemCount) =>
            !!distinctOrderItems.find(
               (distinctOrderItem) =>
                  distinctOrderItem.productId === orderItemCount.productId
            )
      )
      .reduce(
         (acc, orderItemCount) => {
            const orderitemReference = distinctOrderItems.find(
               (orderItem) => orderItem.productId === orderItemCount.productId
            )

            return [
               ...acc,
               {
                  count: orderItemCount._sum.count,
                  title: orderitemReference.product.title,
                  brand: orderitemReference.product.brand.title,
                  categories: orderitemReference.product.categories
                     .map((category) => category.title)
                     .join(' '),
               },
            ]
         },
         [] as Array<{
            count: number
            title: string
            brand: string
            categories: string[]
         }>
      )

   return (
      <div className="container mx-auto p-6 space-y-6">
         <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Reports Overview</h1>
         </header>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5" />
                  Filter Options
               </CardTitle>
               <CardDescription>
                  Filter reports by date range, categories, and brand
               </CardDescription>
            </CardHeader>
            <CardContent>
               <ReportsFilter
                  categories={categories.map((category) => category.title)}
                  brands={brands.map((brand) => brand.title)}
               />
            </CardContent>
         </Card>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
               <CardHeader>
                  <CardTitle>Orders Report</CardTitle>
                  <CardDescription>
                     Summary of orders grouped by date
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {Object.entries(paidOrdersGroupedByDate).map(
                        ([date, orders]) => (
                           <div
                              key={date}
                              className="flex justify-between items-center p-3 bg-muted rounded-lg"
                           >
                              <span className="font-medium">
                                 {new Date(date).toDateString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                 {orders.length} orders
                              </span>
                              <span className="font-semibold">
                                 $
                                 {orders.reduce(
                                    (acc, order) => acc + order.payable,
                                    0
                                 )}
                              </span>
                           </div>
                        )
                     )}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                     Most-sold products in the selected period
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Product</TableHead>
                           <TableHead>Category</TableHead>
                           <TableHead>Brand</TableHead>
                           <TableHead className="text-right">
                              Units Sold
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {orderItemsSortedByCount.map((orderItem) => (
                           <TableRow key={orderItem.title}>
                              <TableCell className="font-medium">
                                 {orderItem.title}
                              </TableCell>
                              <TableCell>{orderItem.categories}</TableCell>
                              <TableCell>{orderItem.brand}</TableCell>
                              <TableCell className="text-right">
                                 {orderItem.count}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
