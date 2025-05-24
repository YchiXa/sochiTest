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

type SearchParams = Record<string, string | string[]>

type IndexPageProps = {
   searchParams: SearchParams
}

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

function formatOrderByParam(
   orderBy: string
): Parameters<typeof prisma.product.findMany>['0']['orderBy'] {
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

function formatSearchParams(searchParams: SearchParams) {
   const search = parseQueryParamToString(searchParams['search'])
   const minPrice = parseQueryParamToString(searchParams['min_price']) || '0'
   const maxPrice = parseQueryParamToString(searchParams['max_price']) || '1000'
   const orderBy = parseQueryParamToString(searchParams['order_by'])
   const category = parseQueryParamToArray(searchParams['category'])
   const brand = parseQueryParamToArray(searchParams['brand'])

   return { search, minPrice, maxPrice, orderBy, category, brand }
}

export default async function Index({ searchParams }: IndexPageProps) {
   const { search, category, brand, maxPrice, minPrice, orderBy } =
      formatSearchParams(searchParams)

   const products = await prisma.product.findMany({
      include: {
         brand: true,
         categories: true,
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
               title="Products"
               description="Below is a list of products we have available for you."
            />
         ) : (
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
         <Separator className="my-8" />
         {isVariableValid(blogs) ? (
            <BlogPostGrid blogs={blogs} />
         ) : (
            <BlogPostSkeletonGrid />
         )}
      </div>
   )
}
