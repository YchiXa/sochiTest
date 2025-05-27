import { getProducts } from '@/app/actions/get-products'
import { SearchSection } from '@/components/composites/search-section'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

export default async function Products({ searchParams }) {
   const products = await getProducts(searchParams)

   const categories = (await prisma.category.findMany()).map(
      (category) => category.title
   )
   const brands = (await prisma.brand.findMany()).map((brand) => brand.title)

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
