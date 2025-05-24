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
import { FilterIcon } from 'lucide-react'

export default async function ReportsPage() {
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
               <div className="flex flex-wrap w-full max-w-full justify-start gap-x-3">
                  <div className="space-y-2 flex-grow">
                     <Label htmlFor="date-from">Date Range</Label>
                     <div className="flex gap-2">
                        <div className="relative flex-1">
                           <div className="flex w-full gap-x-3"></div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2 flex-grow">
                     <Label>Categories</Label>
                     <Select>
                        <SelectTrigger>
                           <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Categories</SelectItem>
                           <SelectItem value="electronics">
                              Electronics
                           </SelectItem>
                           <SelectItem value="clothing">Clothing</SelectItem>
                           <SelectItem value="books">Books</SelectItem>
                           <SelectItem value="home">Home & Garden</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2 flex-grow">
                     <Label>Brand</Label>
                     <Select>
                        <SelectTrigger>
                           <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Brands</SelectItem>
                           <SelectItem value="apple">Apple</SelectItem>
                           <SelectItem value="samsung">Samsung</SelectItem>
                           <SelectItem value="nike">Nike</SelectItem>
                           <SelectItem value="adidas">Adidas</SelectItem>
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
                     <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">2024-01-15</span>
                        <span className="text-sm text-muted-foreground">
                           25 orders
                        </span>
                        <span className="font-semibold">$2,450.00</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">2024-01-14</span>
                        <span className="text-sm text-muted-foreground">
                           18 orders
                        </span>
                        <span className="font-semibold">$1,890.00</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">2024-01-13</span>
                        <span className="text-sm text-muted-foreground">
                           32 orders
                        </span>
                        <span className="font-semibold">$3,120.00</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">2024-01-12</span>
                        <span className="text-sm text-muted-foreground">
                           21 orders
                        </span>
                        <span className="font-semibold">$2,100.00</span>
                     </div>
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
                        <TableRow>
                           <TableCell className="font-medium">
                              iPhone 15 Pro
                           </TableCell>
                           <TableCell>Electronics</TableCell>
                           <TableCell>Apple</TableCell>
                           <TableCell className="text-right">156</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className="font-medium">
                              Air Jordan 1
                           </TableCell>
                           <TableCell>Clothing</TableCell>
                           <TableCell>Nike</TableCell>
                           <TableCell className="text-right">89</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className="font-medium">
                              Galaxy S24
                           </TableCell>
                           <TableCell>Electronics</TableCell>
                           <TableCell>Samsung</TableCell>
                           <TableCell className="text-right">67</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell className="font-medium">
                              Ultraboost 22
                           </TableCell>
                           <TableCell>Clothing</TableCell>
                           <TableCell>Adidas</TableCell>
                           <TableCell className="text-right">45</TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
