import { getReports } from '@/actions/get-reports'
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
import { FilterIcon } from 'lucide-react'

type ReportsPageProps = {
   searchParams: SearchParams
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
   const { orderItemsSortedByCount, paidOrdersGroupedByDate } =
      await getReports(searchParams)
   const categories = await prisma.category.findMany()
   const brands = await prisma.brand.findMany()

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
                     {Object.entries(paidOrdersGroupedByDate).length === 0 && (
                        <strong>No Orders Found</strong>
                     )}
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
