import { PrismaOrderBy } from "@/types/prisma-order-by"

export function formatOrderByParam(
   orderBy: string
): PrismaOrderBy {
   switch (orderBy) {
      case 'title-asc': {
         return { title: 'asc' }
      }
      case 'title-desc': {
         return { title: 'desc' }
      }
      case 'price-asc': {
         return { price: 'asc' }
      }
      case 'price-desc': {
         return { price: 'desc' }
      }
      default: {
         return undefined
      }
   }
}