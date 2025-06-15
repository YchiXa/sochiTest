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
            title="Товары"
            description="Ниже представлен список товаров в вашей корзине."
         />
         <SearchSection brands={brands} categories={categories} />
         <Separator />
         {products.length === 0 && (
            <Heading
               title="Товары не найдены"
               description="Не удалось получить ни одного товара..."
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
