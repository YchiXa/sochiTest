import { getProducts } from '@/app/actions/get-products'
import {
   BlogPostGrid,
   BlogPostSkeletonGrid,
} from '@/components/native/BlogCard'
import Carousel from '@/components/native/Carousel'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { SearchParams } from '@/types/search-params'

type IndexPageProps = {
   searchParams: SearchParams
}

export default async function Index({ searchParams }: IndexPageProps) {
   const products = await getProducts(searchParams)

   const blogs = await prisma.blog.findMany({
      include: { author: true },
      take: 3,
   })

   const banners = await prisma.banner.findMany()

   return (
      <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
         <Carousel images={banners.map((obj) => obj.image)} />
         <Separator className="my-8" />
         {products.length ? (
            <Heading
               title="Товары"
               description="Ниже представлен список товаров, доступных для вас."
            />
         ) : (
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
         <Separator className="my-8" />
         {isVariableValid(blogs) ? (
            <BlogPostGrid blogs={blogs} />
         ) : (
            <BlogPostSkeletonGrid />
         )}
      </div>
   )
}
