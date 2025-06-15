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
import type { UserWithIncludes } from '@/types/prisma'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   name: z.string().min(1, 'Имя обязательно'),
   email: z.string().min(1, 'Email обязателен'),
   phone: z.string().min(1, 'Телефон обязателен'),
   isBanned: z.boolean().default(false).optional(),
})

type UserFormValues = z.infer<typeof formSchema>

interface UserFormProps {
   initialData: UserWithIncludes | null
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()

   const [loading, setLoading] = useState(false)

   const toastMessage = 'Пользователь обновлен.'
   const action = 'Сохранить изменения'

   const defaultValues = initialData
      ? {
           ...initialData,
        }
      : {
           name: '---',
           phone: '---',
           email: '---',
           isBanned: false,
        }

   const form = useForm<UserFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues,
   })

   const onSubmit = async (data: UserFormValues) => {
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
            className="space-y-2 w-full"
         >
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Имя</FormLabel>
                     <FormControl>
                        <Input
                           disabled={loading}
                           placeholder="Полное имя"
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input
                           disabled={loading}
                           placeholder="example@mail.com"
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="phone"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Телефон</FormLabel>
                     <FormControl>
                        <Input
                           disabled={loading}
                           placeholder="+7 (999) 123-45-67"
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="isBanned"
               render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                     <FormControl>
                        <Checkbox
                           checked={field.value}
                           onCheckedChange={field.onChange}
                        />
                     </FormControl>
                     <div className="space-y-1 leading-none">
                        <FormLabel>Заблокирован</FormLabel>
                        <FormDescription>
                           Этот пользователь не сможет оставлять отзывы или
                           оформлять заказы.
                        </FormDescription>
                     </div>
                  </FormItem>
               )}
            />

            <Button disabled={loading} className="ml-auto" type="submit">
               {action}
            </Button>
         </form>
      </Form>
   )
}
