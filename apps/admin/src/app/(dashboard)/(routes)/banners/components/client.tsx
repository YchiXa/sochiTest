import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { BannersColumn, columns } from './table'

interface BannersClientProps {
   data: BannersColumn[]
}

export const BannersClient: React.FC<BannersClientProps> = ({ data }) => {
   const router = useRouter()

   return (
      <div className="block space-y-4 my-6">
         <div className="flex items-center justify-between">
            <Heading
               title={`Баннеры (${data.length})`}
               description="Управляйте баннерами вашего магазина"
            />
            <Button onClick={() => router.push('/banners/new')}>
               <Plus className="mr-2 h-4 w-4" /> Добавить новый
            </Button>
         </div>
         <Separator />
         <DataTable searchKey="label" columns={columns} data={data} />
      </div>
   )
}
