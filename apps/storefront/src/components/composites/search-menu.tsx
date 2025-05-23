'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Search } from 'lucide-react'
import { useState } from 'react'

export function SearchMenu() {
   const [open, setOpen] = useState(false)
   const [priceRange, setPriceRange] = useState([0, 1000])

   const categories = [
      { id: 'electronics', label: 'Electronics' },
      { id: 'clothing', label: 'Clothing' },
      { id: 'books', label: 'Books' },
      { id: 'home', label: 'Home & Kitchen' },
      { id: 'sports', label: 'Sports & Outdoors' },
   ]

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               className="w-full justify-start text-muted-foreground"
            >
               <Search className="mr-2 h-4 w-4" />
               Search...
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Search Products</DialogTitle>
               <DialogDescription>
                  Search for your product using advanced filters.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                  <Input placeholder="Search Text" className="h-10" />
               </div>

               <div>
                  <Select>
                     <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Order By" />
                     </SelectTrigger>

                     <SelectContent>
                        <SelectItem value="price-desc">
                           Most expensive products
                        </SelectItem>
                        <SelectItem value="price-asc">
                           Cheapest products
                        </SelectItem>
                        <SelectItem value="title-asc">
                           Title in ascending order (A-Z)
                        </SelectItem>
                        <SelectItem value="title-desc">
                           Title in descending order (Z-A)
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <section className="grid grid-cols-2 gap-x-3">
                  <div className="grid gap-2">
                     <h3 className="text-sm font-medium">Categories</h3>
                     <div className="grid gap-2">
                        {categories.map((category) => (
                           <div
                              key={category.id}
                              className="flex items-center space-x-2"
                           >
                              <Checkbox id={category.id} />
                              <Label htmlFor={category.id}>
                                 {category.label}
                              </Label>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid gap-2">
                     <h3 className="text-sm font-medium">Brand</h3>
                     <div className="grid gap-2">
                        {categories.map((category) => (
                           <div
                              key={category.id}
                              className="flex items-center space-x-2"
                           >
                              <Checkbox id={category.id} />
                              <Label htmlFor={category.id}>
                                 {category.label}
                              </Label>
                           </div>
                        ))}
                     </div>
                  </div>
               </section>

               <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <Slider
                     defaultValue={[0, 1000]}
                     max={1000}
                     step={1}
                     value={priceRange}
                     onValueChange={setPriceRange}
                     className="py-4"
                  />
                  <div className="flex items-center justify-between">
                     <div className="grid gap-1">
                        <Label htmlFor="min-price">Min Price</Label>
                        <Input
                           id="min-price"
                           type="number"
                           value={priceRange[0]}
                           onChange={(e) =>
                              setPriceRange([
                                 Number.parseInt(e.target.value),
                                 priceRange[1],
                              ])
                           }
                           className="h-8 w-[120px]"
                        />
                     </div>
                     <div className="grid gap-1">
                        <Label htmlFor="max-price">Max Price</Label>
                        <Input
                           id="max-price"
                           type="number"
                           value={priceRange[1]}
                           onChange={(e) =>
                              setPriceRange([
                                 priceRange[0],
                                 Number.parseInt(e.target.value),
                              ])
                           }
                           className="h-8 w-[120px]"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   )
}
