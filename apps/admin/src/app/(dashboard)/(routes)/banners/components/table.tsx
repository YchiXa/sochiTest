'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export type BannersColumn = {
   id: string
   label: string
   createdAt: string
}

export const columns: ColumnDef<BannersColumn>[] = [
   {
      accessorKey: 'label',
      header: 'Название',
   },
   {
      accessorKey: 'createdAt',
      header: 'Дата создания',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/banners/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]

interface BannerClientProps {
   data: BannersColumn[]
}

export const BannersClient: React.FC<BannerClientProps> = ({ data }) => {
   const params = useParams()
   const router = useRouter()

   return <DataTable searchKey="label" columns={columns} data={data} />
}
