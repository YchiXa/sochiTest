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
import ImageUpload from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Banner } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   label: z.string().min(1, 'Название обязательно'),
   image: z.string().min(1, 'Изображение обязательно'),
})

type BannerFormValues = z.infer<typeof formSchema>

interface BannerFormProps {
   initialData: Banner | null
}

export const BannerForm: React.FC<BannerFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Редактировать баннер' : 'Создать баннер'
   const description = initialData
      ? 'Редактирование баннера.'
      : 'Добавить новый баннер'
   const toastMessage = initialData ? 'Баннер обновлен.' : 'Баннер создан.'
   const action = initialData ? 'Сохранить изменения' : 'Создать'

   const form = useForm<BannerFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || {
         label: '',
         image: '',
      },
   })

   const onSubmit = async (data: BannerFormValues) => {
      try {
         setLoading(true)
         if (initialData) {
            await fetch(`/api/banners/${params.bannerId}`, {
               method: 'PATCH',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         } else {
            await fetch(`/banners`, {
               method: 'POST',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         }
         router.refresh()
         router.push(`/banners`)
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

         await fetch(`/api/banners/${params.bannerId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         router.refresh()
         router.push(`/banners`)
         toast.success('Баннер удален.')
      } catch (error: any) {
         toast.error(
            'Убедитесь, что вы удалили все категории, использующие этот баннер.'
         )
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
               <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Фоновое изображение</FormLabel>
                        <FormControl>
                           <ImageUpload
                              value={field.value ? [field.value] : []}
                              disabled={loading}
                              onChange={(url) => field.onChange(url)}
                              onRemove={() => field.onChange('')}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="label"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Название</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Введите название баннера"
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
