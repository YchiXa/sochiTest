'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { PaymentColumn, columns } from './columns'

interface PaymentClientProps {
   data: PaymentColumn[]
}

export const PaymentClient: React.FC<PaymentClientProps> = ({ data }) => {
   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Платежи (${data.length})`}
            description="Управляйте заказами вашего магазина"
         />
         <Separator />
         <DataTable searchKey="products" columns={columns} data={data} />
      </div>
   )
}
