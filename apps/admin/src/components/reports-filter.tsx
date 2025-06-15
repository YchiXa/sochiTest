'use client'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { parseQueryParamToDate } from '@/utils/format-search-params'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useState } from 'react'

export type ReportsFilterProps = {
   categories: string[]
   brands: string[]
}

export type SelectedFilters = {
   category: string
   brand: string
   startDate: string | undefined
   endDate: string | undefined
}

export function ReportsFilter({ categories, brands }: ReportsFilterProps) {
   const searchParams = useSearchParams()
   const router = useRouter()
   const [selectedFilters, setSelectedFilters] = useState({
      category: searchParams.get('category') ?? '',
      brand: searchParams.get('brand') ?? '',
      startDate: searchParams.get('start_date') || undefined,
      endDate: searchParams.get('end_date') || undefined,
   })

   function handleUpdateSelectedFilters(partial: Partial<SelectedFilters>) {
      setSelectedFilters((prev) => ({ ...prev, ...partial }))
   }

   function handleSubmitFilters() {
      const newSearchParams = new URLSearchParams()

      if (selectedFilters.category) {
         selectedFilters.category === 'all'
            ? newSearchParams.delete('category')
            : newSearchParams.set('category', selectedFilters.category)
      }

      if (selectedFilters.brand) {
         selectedFilters.brand === 'all'
            ? newSearchParams.delete('brand')
            : newSearchParams.set('brand', selectedFilters.brand)
      }

      if (selectedFilters.startDate) {
         newSearchParams.set('start_date', selectedFilters.startDate)
      }

      if (selectedFilters.endDate) {
         newSearchParams.set('end_date', selectedFilters.endDate)
      }

      startTransition(() => {
         router.replace(`?${newSearchParams.toString()}`, {
            scroll: false,
         })
      })
   }

   function handleClearFilters() {
      const newSearchParams = new URLSearchParams()
      setSelectedFilters({
         category: '',
         brand: '',
         startDate: '',
         endDate: '',
      })
      startTransition(() => {
         router.replace(`?${newSearchParams.toString()}`, {
            scroll: false,
         })
      })
   }

   return (
      <>
         <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="space-y-2 w-full lg:flex-1">
               <Label>Начальная дата</Label>
               <div className="flex flex-grow gap-2">
                  <div className="relative w-full">
                     <DatePicker
                        date={parseQueryParamToDate(selectedFilters.startDate)}
                        handleChangeDate={(date) =>
                           handleUpdateSelectedFilters({
                              startDate: date?.toJSON(),
                           })
                        }
                     />
                  </div>
               </div>
            </div>

            <div className="space-y-2 w-full lg:flex-1">
               <Label>Конечная дата</Label>
               <div className="flex flex-grow gap-2">
                  <div className="relative w-full">
                     <DatePicker
                        date={parseQueryParamToDate(selectedFilters.endDate)}
                        handleChangeDate={(date) =>
                           handleUpdateSelectedFilters({
                              endDate: date.toJSON(),
                           })
                        }
                     />
                  </div>
               </div>
            </div>

            <div className="space-y-2 w-full lg:flex-1">
               <Label>Категории</Label>
               <Select
                  defaultValue={selectedFilters.category}
                  onValueChange={(value) =>
                     handleUpdateSelectedFilters({ category: value })
                  }
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Все категории</SelectItem>
                     {categories.map((category) => (
                        <SelectItem
                           key={category}
                           value={category}
                           id={category}
                        >
                           {category}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2 w-full lg:flex-1">
               <Label>Бренды</Label>
               <Select
                  defaultValue={selectedFilters.brand}
                  onValueChange={(value) =>
                     handleUpdateSelectedFilters({ brand: value })
                  }
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Выберите бренд" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Все бренды</SelectItem>
                     {brands.map((brand) => (
                        <SelectItem key={brand} value={brand} id={brand}>
                           {brand}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         <div className="flex gap-2 mt-4">
            <Button onClick={handleSubmitFilters}>Применить фильтры</Button>
            <Button onClick={handleClearFilters} variant="outline">
               Сбросить
            </Button>
         </div>
      </>
   )
}
