import prisma from '@/lib/prisma'
import { SearchParams } from '@/types/search-params'
import { formatOrderByParam } from '@/utils/format-order-by-param'
import { formatSearchParams } from '@/utils/format-search-params'

export async function getProducts(searchParams: SearchParams) {
   const { search, category, brand, maxPrice, minPrice, orderBy } =
      formatSearchParams(searchParams)
      
   const products = await prisma.product.findMany({
      include: {
         brand: true,
         categories: true,
         crossSells: { select: { id: true } },
      },
      orderBy: formatOrderByParam(orderBy),
      where: {
         title: { contains: search, mode: 'insensitive' },
         price: { gte: Number(minPrice), lte: Number(maxPrice) },
         ...(category.length
            ? {
                 categories: {
                    every: { title: { in: category, mode: 'insensitive' } },
                 },
              }
            : {}),
         ...(brand.length
            ? {
                 brand: {
                    title: { in: brand, mode: 'insensitive' },
                 },
              }
            : {}),
      },
   })

   return products
}
