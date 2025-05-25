import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { FilterIcon } from 'lucide-react'

export default async function ReportsPage() {
   const categories = await prisma.category.findMany()
   const brands = await prisma.brand.findMany()
   const paidOrders = await prisma.order.findMany({
      where: {
         isPaid: true,
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
      include: {
         product: { select: { title: true, brand: true, categories: true } },
      },
   })

   const orderItemsCount = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
         count: true,
      },
      orderBy: { _count: { count: 'desc' } },
   })

   const orderItemsSortedByCount = orderItemsCount.reduce(
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
               <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                  <div className="space-y-2 w-full lg:flex-1">
                     <Label>Start Date</Label>
                     <div className="flex flex-grow gap-2">
                        <div className="relative w-full">
                           <DatePicker />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2 w-full lg:flex-1">
                     <Label>End Date</Label>
                     <div className="flex flex-grow gap-2">
                        <div className="relative w-full">
                           <DatePicker />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2 w-full lg:flex-1">
                     <Label>Categories</Label>
                     <Select>
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Categories</SelectItem>
                           {categories.map((category) => (
                              <SelectItem
                                 key={category.id}
                                 value={category.title}
                                 id={category.id}
                              >
                                 {category.title}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2 w-full lg:flex-1">
                     <Label>Brand</Label>
                     <Select>
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Brands</SelectItem>
                           {brands.map((brand) => (
                              <SelectItem
                                 key={brand.id}
                                 value={brand.title}
                                 id={brand.title}
                              >
                                 {brand.title}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="flex gap-2 mt-4">
                  <Button>Apply Filters</Button>
                  <Button variant="outline">Reset</Button>
               </div>
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
