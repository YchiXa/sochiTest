'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, XIcon } from 'lucide-react'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type PaymentColumn = {
   id: string
   number: string
   isSuccessful: boolean
   payable: string
   status: string
   createdAt: string
}

export const columns: ColumnDef<PaymentColumn>[] = [
   {
      accessorKey: 'number',
      header: 'Номер платежа',
   },
   {
      accessorKey: 'isSuccessful',
      header: 'Статус',
      cell: (props) => (props.cell.getValue() ? <CheckIcon /> : <XIcon />),
   },
   {
      accessorKey: 'payable',
      header: 'Сумма',
   },
   {
      accessorKey: 'status',
      header: 'Состояние',
   },
   {
      accessorKey: 'createdAt',
      header: 'Дата',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/payments/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
