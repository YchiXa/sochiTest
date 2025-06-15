'use client'

import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useSearchProducts } from '@/hooks/use-search-products'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export type SearcSectionProps = {
   categories: string[]
   brands: string[]
}

export function SearchSection({ categories, brands }: SearcSectionProps) {
   const [brandOpen, setBrandOpen] = useState(false)
   const [categoryOpen, setCategoryOpen] = useState(false)
   const {
      handleSearchForPriceRangeWithSlider,
      handleSearchForPriceRangeWithText,
      handleSearchWithMultiQueryParam,
      handleSearchWithQueryParam,
      priceRange,
      searchParams,
      selectedBrands,
      selectedCategories,
   } = useSearchProducts()

   return (
      <div className="w-full mx-auto">
         <div className="grid gap-6">
            <div className="space-y-2">
               <Label htmlFor="search" className="text-sm font-medium">
                  Поиск
               </Label>
               <Input
                  id="search"
                  placeholder="Поиск товаров..."
                  className="h-11"
                  onChange={(e) =>
                     handleSearchWithQueryParam('search', e.target.value)
                  }
                  defaultValue={searchParams.get('search')}
               />
            </div>

            <div className="space-y-2">
               <Label className="text-sm font-medium">Сортировка</Label>
               <Select
                  defaultValue={searchParams.get('order_by') || undefined}
                  onValueChange={(value) =>
                     handleSearchWithQueryParam('order_by', value)
                  }
               >
                  <SelectTrigger className="h-11">
                     <SelectValue placeholder="Выберите сортировку" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                     <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                     <SelectItem value="title-asc">
                        По названию (А-Я)
                     </SelectItem>
                     <SelectItem value="title-desc">
                        По названию (Я-А)
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex gap-x-5">
               <div className="space-y-2">
                  <Label className="text-sm font-medium block">
                     Categories
                  </Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           role="combobox"
                           aria-expanded={categoryOpen}
                           className="h-11 justify-between"
                        >
                           {selectedCategories.length > 0
                              ? `${selectedCategories.length} selected`
                              : 'Select categories'}
                           <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-[300px] p-0">
                        <Command>
                           <CommandInput placeholder="Поиск категорий..." />
                           <CommandList>
                              <CommandEmpty>Категории не найдены.</CommandEmpty>
                              <CommandGroup>
                                 {categories.map((category) => (
                                    <CommandItem
                                       key={category}
                                       value={category}
                                       onSelect={() =>
                                          handleSearchWithMultiQueryParam(
                                             'category',
                                             category
                                          )
                                       }
                                    >
                                       <Check
                                          className={cn(
                                             'mr-2 h-4 w-4',
                                             selectedCategories.includes(
                                                category
                                             )
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                          )}
                                       />
                                       {category}
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
               </div>

               <div className="space-y-2">
                  <Label className="text-sm font-medium block">Brands</Label>
                  <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           role="combobox"
                           aria-expanded={brandOpen}
                           className="h-11 justify-between"
                        >
                           {selectedBrands.length > 0
                              ? `Выбрано: ${selectedBrands.length}`
                              : 'Выберите бренды'}
                           <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-[300px] p-0">
                        <Command>
                           <CommandInput placeholder="Поиск брендов..." />
                           <CommandList>
                              <CommandEmpty>Бренды не найдены.</CommandEmpty>
                              <CommandGroup>
                                 {brands.map((brand) => (
                                    <CommandItem
                                       key={brand}
                                       value={brand}
                                       onSelect={() =>
                                          handleSearchWithMultiQueryParam(
                                             'brand',
                                             brand
                                          )
                                       }
                                    >
                                       <Check
                                          className={cn(
                                             'mr-2 h-4 w-4',
                                             selectedBrands.includes(brand)
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                          )}
                                       />
                                       {brand}
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
               </div>
            </div>

            <div className="space-y-4">
               <Label className="text-sm font-medium">Ценовой диапазон</Label>
               <div className="px-2">
                  <Slider
                     defaultValue={[0, 1000]}
                     max={1000}
                     step={1}
                     value={priceRange}
                     onValueChange={handleSearchForPriceRangeWithSlider}
                     className="py-4"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <Label
                        htmlFor="min-price"
                        className="text-xs text-muted-foreground"
                     >
                        Мин. цена
                     </Label>
                     <div className="relative">
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
                           className="h-11"
                        />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <Label
                        htmlFor="max-price"
                        className="text-xs text-muted-foreground"
                     >
                        Макс. цена
                     </Label>
                     <div className="relative">
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
                           className="h-11"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
