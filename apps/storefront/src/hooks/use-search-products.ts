import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { startTransition, useRef, useState } from 'react'

export function useSearchProducts() {
   const searchParams = useSearchParams()
   const selectedCategories = searchParams.getAll('category')
   const selectedBrands = searchParams.getAll('brand')
   const [priceRange, setPriceRange] = useState([
      Number(searchParams.get('min_price') ?? '0'),
      Number(searchParams.get('max_price') ?? '1000'),
   ])
   const sliderDebounce = useRef<NodeJS.Timeout>(null)
   const router = useRouter()

   function handleSearchWithMultiQueryParam(key: string, value: string) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      const currentMultiValues = newSearchParams.getAll(key)

      if (currentMultiValues.includes(value)) {
         newSearchParams.delete(key)
         currentMultiValues
            .filter((queryValue) => queryValue !== value)
            .forEach((filteredValue) =>
               newSearchParams.append(key, filteredValue)
            )
      } else {
         newSearchParams.append(key, value)
      }
      startTransition(() => {
         router.replace(`?${newSearchParams.toString()}`, {
            scroll: false,
         })
      })
   }

   function handleSearchWithQueryParam(key: string, value: string) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set(key, value)
      startTransition(() => {
         router.replace(`?${newSearchParams.toString()}`, {
            scroll: false,
         })
      })
   }

   function handleSearchForPriceRangeWithText(range: [number, number]) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('min_price', String(range[0]))
      newSearchParams.set('max_price', String(range[1]))

      setPriceRange(range)

      startTransition(() => {
         router.replace(`?${newSearchParams.toString()}`, {
            scroll: false,
         })
      })
   }

   function handleSearchForPriceRangeWithSlider(range: [number, number]) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('min_price', String(range[0]))
      newSearchParams.set('max_price', String(range[1]))
      setPriceRange(range)

      if (sliderDebounce.current) {
         clearTimeout(sliderDebounce.current)
      }

      sliderDebounce.current = setTimeout(() => {
         startTransition(() => {
            router.replace(`?${newSearchParams.toString()}`, {
               scroll: false,
            })
         })
      }, 500)
   }

   return {
      handleSearchWithMultiQueryParam,
      handleSearchWithQueryParam,
      handleSearchForPriceRangeWithText,
      handleSearchForPriceRangeWithSlider,
      priceRange,
      searchParams,
      selectedBrands,
      selectedCategories
   }
}
