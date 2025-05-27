import { SearchSection } from '@/components/composites/search-section'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { formatOrderByParam } from '@/utils/format-order-by-param'
import { formatSearchParams } from '@/utils/format-search-params'

export default async function Products({ searchParams }) {
   const { search, category, brand, maxPrice, minPrice, orderBy } =
      formatSearchParams(searchParams)
   const categories = (await prisma.category.findMany()).map(
      (category) => category.title
   )
   const brands = (await prisma.brand.findMany()).map((brand) => brand.title)
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

   return (
      <>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
         />
         <SearchSection brands={brands} categories={categories} />
         <Separator />
         {products.length === 0 && (
            <Heading
               title="No Products Found"
               description="We weren't able to retriev any products..."
            />
         )}
         {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'featured':
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
      case 'most_expensive':
         orderBy = {
            price: 'desc',
         }
         break
      case 'least_expensive':
         orderBy = {
            price: 'asc',
         }
         break

      default:
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
   }

   return orderBy
}
