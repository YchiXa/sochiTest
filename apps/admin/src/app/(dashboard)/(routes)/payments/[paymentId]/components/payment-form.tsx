'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { OrderWithIncludes } from '@/types/prisma'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   status: z.string().min(1),
   shipping: z.coerce.number().min(1),
   payable: z.coerce.number().min(1),
   discount: z.coerce.number().min(0),
   isPaid: z.boolean().default(false).optional(),
   isCompleted: z.boolean().default(false).optional(),
})

type PaymentFormValues = z.infer<typeof formSchema>

interface PaymentFormProps {
   initialData: OrderWithIncludes | null
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()

   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Редактировать платеж' : 'Создать платеж'
   const description = initialData
      ? 'Редактирование платежа.'
      : 'Добавить новый платеж'
   const toastMessage = initialData ? 'Платеж обновлен.' : 'Платеж создан.'
   const action = initialData ? 'Сохранить изменения' : 'Создать'

   const defaultValues = initialData
      ? {
           ...initialData,
        }
      : {
           status: '---',
           shipping: 0,
           payable: 0,
           discount: 0,
           isPaid: false,
           isCompleted: false,
        }

   const form = useForm<PaymentFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues,
   })

   const onSubmit = async (data: PaymentFormValues) => {
      try {
         setLoading(true)

         if (initialData) {
            await fetch(`/api/products/${params.productId}`, {
               method: 'PATCH',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         } else {
            await fetch(`/api/products`, {
               method: 'POST',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         }

         router.refresh()
         router.push(`/products`)
         toast.success(toastMessage)
      } catch (error: any) {
         toast.error('Что-то пошло не так.')
      } finally {
         setLoading(false)
      }
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
         >
            <div>
               <FormField
                  control={form.control}
                  name="shipping"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Стоимость доставки</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              disabled={loading}
                              placeholder="0.00"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="payable"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>К оплате</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              disabled={loading}
                              placeholder="0.00"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Скидка</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              disabled={loading}
                              placeholder="9.99"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isPaid"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>Оплачен</FormLabel>
                           <FormDescription>
                              Этот заказ будет отмечен как оплаченный
                           </FormDescription>
                        </div>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isCompleted"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>Доступен</FormLabel>
                           <FormDescription>
                              Этот платеж будет отображаться в системе.
                           </FormDescription>
                        </div>
                     </FormItem>
                  )}
               />
            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
               {action}
            </Button>
         </form>
      </Form>
   )
}
