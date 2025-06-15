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
   status: z.string().min(1, 'Статус обязателен'),
   shipping: z.coerce.number().min(1, 'Стоимость доставки обязательна'),
   payable: z.coerce.number().min(1, 'Сумма к оплате обязательна'),
   discount: z.coerce.number().min(0, 'Скидка не может быть отрицательной'),
   isPaid: z.boolean().default(false).optional(),
   isCompleted: z.boolean().default(false).optional(),
})

type OrderFormValues = z.infer<typeof formSchema>

interface OrderFormProps {
   initialData: OrderWithIncludes | null
}

export const OrderForm = ({ initialData }: OrderFormProps): JSX.Element => {
   const params = useParams()
   const router = useRouter()
   const [loading, setLoading] = useState(false)

   const defaultValues = initialData
      ? {
           status: initialData.status,
           shipping: initialData.shipping,
           payable: initialData.payable,
           discount: initialData.discount,
           isPaid: initialData.isPaid,
           isCompleted: initialData.isCompleted,
        }
      : {
           status: '',
           shipping: 0,
           payable: 0,
           discount: 0,
           isPaid: false,
           isCompleted: false,
        }

   const form = useForm<OrderFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues,
   })

   const onSubmit = async (data: OrderFormValues) => {
      try {
         setLoading(true)

         if (initialData) {
            await fetch(`/api/orders/${params.orderId}`, {
               method: 'PATCH',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         } else {
            await fetch(`/api/orders`, {
               method: 'POST',
               body: JSON.stringify(data),
               cache: 'no-store',
            })
         }

         router.refresh()
         router.push(`/orders`)
         toast.success(initialData ? 'Заказ обновлен.' : 'Заказ создан.')
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
            <div className="grid grid-cols-3 gap-8">
               <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Статус</FormLabel>
                        <FormControl>
                           <Input
                              disabled={loading}
                              placeholder="Статус заказа"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="shipping"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Доставка</FormLabel>
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
                              placeholder="0.00"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
            <div className="grid grid-cols-2 gap-8">
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
                              Заказ был оплачен покупателем.
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
                           <FormLabel>Завершен</FormLabel>
                           <FormDescription>
                              Заказ был доставлен и завершен.
                           </FormDescription>
                        </div>
                     </FormItem>
                  )}
               />
            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
               {initialData ? 'Сохранить изменения' : 'Создать заказ'}
            </Button>
         </form>
      </Form>
   )
}
