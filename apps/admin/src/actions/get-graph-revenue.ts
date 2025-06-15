import prisma from '@/lib/prisma'

interface GraphData {
   name: string
   total: number
}

export const getGraphRevenue = async (): Promise<GraphData[]> => {
   const paidOrders = await prisma.order.findMany({
      where: {
         isPaid: true,
      },
      include: {
         orderItems: {
            include: {
               product: { include: { categories: true } },
            },
         },
      },
   })

   const monthlyRevenue: { [key: number]: number } = {}

   // Grouping the orders by month and summing the revenue
   for (const order of paidOrders) {
      const month = order.createdAt.getMonth() // 0 for Jan, 1 for Feb, ...

      // Adding the revenue for this order to the respective month
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.payable
   }

   // Converting the grouped data into the format expected by the graph
   const graphData: GraphData[] = [
      { name: 'Янв', total: 0 },
      { name: 'Фев', total: 0 },
      { name: 'Мар', total: 0 },
      { name: 'Апр', total: 0 },
      { name: 'Май', total: 0 },
      { name: 'Июн', total: 0 },
      { name: 'Июл', total: 0 },
      { name: 'Авг', total: 0 },
      { name: 'Сен', total: 0 },
      { name: 'Окт', total: 0 },
      { name: 'Ноя', total: 0 },
      { name: 'Дек', total: 0 },
   ]

   // Filling in the revenue data
   for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
   }

   return graphData
}
