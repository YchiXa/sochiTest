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
import { useSearchProducts } from '@/hooks/use-search-products'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

export type SearchMenuProps = {
   categories: string[]
   brands: string[]
}

export function SearchMenu({ categories, brands }: SearchMenuProps) {
   const {
      handleSearchForPriceRangeWithSlider,
      handleSearchForPriceRangeWithText,
      handleSearchWithMultiQueryParam,
      handleSearchWithQueryParam,
      priceRange,
      searchParams,
   } = useSearchProducts()
   const [open, setOpen] = useState(false)

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
                  <Input
                     placeholder="Search Text"
                     className="h-10"
                     onChange={(e) =>
                        handleSearchWithQueryParam('search', e.target.value)
                     }
                     defaultValue={searchParams.get('search')}
                  />
               </div>

               <div>
                  <Select
                     defaultValue={searchParams.get('order_by') || undefined}
                     onValueChange={(value) =>
                        handleSearchWithQueryParam('order_by', value)
                     }
                  >
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
                              key={category}
                              className="flex items-center space-x-2 mt-2"
                           >
                              <Checkbox
                                 id={category}
                                 onClick={() =>
                                    handleSearchWithMultiQueryParam(
                                       'category',
                                       category
                                    )
                                 }
                                 defaultChecked={searchParams
                                    .getAll('category')
                                    .includes(category)}
                              />
                              <Label
                                 htmlFor={category}
                                 onClick={() =>
                                    handleSearchWithMultiQueryParam(
                                       'category',
                                       category
                                    )
                                 }
                              >
                                 {category}
                              </Label>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid gap-2">
                     <h3 className="text-sm font-medium">Brand</h3>
                     <div className="grid gap-2">
                        {brands.map((brand) => (
                           <div
                              key={brand}
                              className="flex items-center space-x-2 mt-2"
                           >
                              <Checkbox
                                 id={brand}
                                 onClick={() =>
                                    handleSearchWithMultiQueryParam(
                                       'brand',
                                       brand
                                    )
                                 }
                                 defaultChecked={searchParams
                                    .getAll('brand')
                                    .includes(brand)}
                              />
                              <Label
                                 htmlFor={brand}
                                 onClick={() =>
                                    handleSearchWithMultiQueryParam(
                                       'brand',
                                       brand
                                    )
                                 }
                              >
                                 {brand}
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
                     onValueChange={handleSearchForPriceRangeWithSlider}
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
                              handleSearchForPriceRangeWithText([
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
                              handleSearchForPriceRangeWithText([
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
