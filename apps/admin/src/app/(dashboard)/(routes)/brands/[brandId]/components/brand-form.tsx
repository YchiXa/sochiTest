'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Brand } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   title: z.string().min(2),
   description: z.string().min(1).optional(),
   logo: z.string().url().optional(),
})

type BrandFormValues = z.infer<typeof formSchema>

interface BrandFormProps {
   initialData: Brand | null
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Редактировать бренд' : 'Создать бренд'
   const description = initialData
      ? 'Редактирование бренда.'
      : 'Добавить новый бренд'
   const toastMessage = initialData ? 'Бренд обновлен.' : 'Бренд создан.'
   const action = initialData ? 'Сохранить изменения' : 'Создать'

   const form = useForm<BrandFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || {
         title: '',
         description: '',
         logo: '',
      },
   })

   const onSubmit = async (data: BrandFormValues) => {
      try {
         setLoading(true)
         if (initialData) {
            await fetch(`/api/brands/${params.brandId}`, {
               method: 'PATCH',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         } else {
            await fetch(`/api/brands`, {
               method: 'POST',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         }
         router.refresh()
         router.push(`/brands`)
         toast.success(toastMessage)
      } catch (error: any) {
         toast.error('Что-то пошло не так.')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)

         await fetch(`/api/brands/${params.brandId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         router.refresh()
         router.push(`/brands`)
         toast.success('Бренд удален.')
      } catch (error: any) {
         toast.error('Убедитесь, что вы удалили все продукты этого бренда.')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
               >
                  <Trash className="h-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-8 w-full"
            >
               <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Название</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Название бренда"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Описание</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Описание бренда"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="logo"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>URL логотипа</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="https://example.com/logo.png"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   )
}
