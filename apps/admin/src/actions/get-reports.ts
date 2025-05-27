import prisma from '@/lib/prisma'
import { SearchParams } from '@/types/search-params'
import { formatSearchParams } from '@/utils/format-search-params'

function setDateParamToSearch(startDate: Date | null, endDate: Date | null) {
   return {
      createdAt: {
         ...(startDate ? { gte: startDate } : {}),
         ...(endDate ? { lte: endDate } : {}),
      },
   }
}

export async function getReports(searchParams: SearchParams) {
   const { startDate, endDate, brand, category } =
      formatSearchParams(searchParams)

   const paidOrders = await prisma.order.findMany({
      where: {
         isPaid: true,
         orderItems: {
            every: {
               product: {
                  ...(brand
                     ? {
                          brand: {
                             title: { equals: brand, mode: 'insensitive' },
                          },
                       }
                     : {}),
                  ...(category
                     ? {
                          categories: {
                             every: {
                                title: {
                                   equals: category,
                                   mode: 'insensitive',
                                },
                             },
                          },
                       }
                     : {}),
               },
            },
         },
         ...setDateParamToSearch(startDate, endDate),
      },
      include: {
         orderItems: {
            include: { product: { select: { brand: true, categories: true } } },
         },
      },
   })

   const paidOrdersGroupedByDate = paidOrders.reduce(
      (acc, currentOrder) => {
         const dateIgnoringTime = new Date(currentOrder.createdAt.toJSON())
         dateIgnoringTime.setHours(0, 0, 0, 0)

         return {
            ...acc,
            [dateIgnoringTime.toJSON()]: [
               ...(Array.isArray(acc[dateIgnoringTime.toJSON()])
                  ? acc[dateIgnoringTime.toJSON()]
                  : []),
               currentOrder,
            ],
         }
      },
      {} as Record<string, typeof paidOrders>
   )

   const distinctOrderItems = await prisma.orderItem.findMany({
      distinct: ['productId'],
      where: {
         product: {
            ...(category
               ? {
                    categories: {
                       every: {
                          title: { equals: category, mode: 'insensitive' },
                       },
                    },
                 }
               : {}),

            ...(brand
               ? { brand: { title: { equals: brand, mode: 'insensitive' } } }
               : {}),
         },
         order: { ...setDateParamToSearch(startDate, endDate), isPaid: true },
      },
      include: {
         order: { select: { createdAt: true } },
         product: { select: { title: true, brand: true, categories: true } },
      },
   })

   const orderItemsCount = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
         count: true,
      },
      where: {
         order: {
            ...setDateParamToSearch(startDate, endDate),
         },
         product: {
            ...(category
               ? {
                    categories: {
                       every: {
                          title: { equals: category, mode: 'insensitive' },
                       },
                    },
                 }
               : {}),

            ...(brand
               ? { brand: { title: { equals: brand, mode: 'insensitive' } } }
               : {}),
         },
      },
      orderBy: { _count: { count: 'desc' } },
   })

   const orderItemsSortedByCount = orderItemsCount
      .filter(
         (orderItemCount) =>
            !!distinctOrderItems.find(
               (distinctOrderItem) =>
                  distinctOrderItem.productId === orderItemCount.productId
            )
      )
      .reduce(
         (acc, orderItemCount) => {
            const orderitemReference = distinctOrderItems.find(
               (orderItem) => orderItem.productId === orderItemCount.productId
            )

            return [
               ...acc,
               {
                  count: orderItemCount._sum.count,
                  title: orderitemReference.product.title,
                  brand: orderitemReference.product.brand.title,
                  categories: orderitemReference.product.categories
                     .map((category) => category.title)
                     .join(' '),
               },
            ]
         },
         [] as Array<{
            count: number
            title: string
            brand: string
            categories: string[]
         }>
      )

   return { paidOrdersGroupedByDate, orderItemsSortedByCount }
}
