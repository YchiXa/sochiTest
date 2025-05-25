import { SearchParams } from "@/types/search-params"

function parseQueryParamToString(value: unknown) {
   return typeof value === 'string' ? value : ''
}

function parseQueryParamToArray(value: unknown) {
   return typeof value === 'string'
      ? [value]
      : Array.isArray(value)
        ? value
        : []
}

export function formatSearchParams(searchParams: SearchParams) {
   const search = parseQueryParamToString(searchParams['search'])
   const minPrice = parseQueryParamToString(searchParams['min_price']) || '0'
   const maxPrice = parseQueryParamToString(searchParams['max_price']) || '1000'
   const orderBy = parseQueryParamToString(searchParams['order_by'])
   const category = parseQueryParamToArray(searchParams['category'])
   const brand = parseQueryParamToArray(searchParams['brand'])

   return { search, minPrice, maxPrice, orderBy, category, brand }
}