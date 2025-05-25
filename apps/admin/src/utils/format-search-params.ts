import { SearchParams } from "@/types/search-params"

function parseQueryParamToString(value: unknown) {
   return typeof value === 'string' ? value : ''
}

export function parseQueryParamToDate(value: unknown) {
   const date = new Date(value as string);
  return !isNaN(date.valueOf()) && date.toString() !== 'Invalid Date' ? date : undefined;
}

export function formatSearchParams(searchParams: SearchParams) {
   const startDate = parseQueryParamToDate(searchParams['start_date'])
   const endDate = parseQueryParamToDate(searchParams['end_date']) 
   const category = parseQueryParamToString(searchParams['category'])
   const brand = parseQueryParamToString(searchParams['brand'])

   return { startDate, endDate, category, brand }
}