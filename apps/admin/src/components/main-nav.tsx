'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export function MainNav({
   className,
   ...props
}: React.HTMLAttributes<HTMLElement>) {
   const pathname = usePathname()

   const routes = [
      {
         href: `/banners`,
         label: 'Баннеры',
         active: pathname.includes(`/banners`),
      },
      {
         href: `/categories`,
         label: 'Категории',
         active: pathname.includes(`/categories`),
      },
      {
         href: `/products`,
         label: 'Товары',
         active: pathname.includes(`/products`),
      },
      {
         href: `/orders`,
         label: 'Заказы',
         active: pathname.includes(`/orders`),
      },
      {
         href: `/payments`,
         label: 'Платежи',
         active: pathname.includes(`/payments`),
      },
      {
         href: `/users`,
         label: 'Пользователи',
         active: pathname.includes(`/users`),
      },
      {
         href: `/brands`,
         label: 'Бренды',
         active: pathname.includes(`/brands`),
      },
      {
         href: `/codes`,
         label: 'Промокоды',
         active: pathname.includes(`/codes`),
      },
      {
         href: '/reports',
         label: 'Отчеты',
         active: pathname.includes('/reports'),
      },
   ]

   return (
      <nav
         className={cn('flex items-center space-x-4 lg:space-x-6', className)}
         {...props}
      >
         {routes.map((route) => (
            <Link
               key={route.href}
               href={route.href}
               className={cn(
                  'text-sm transition-colors hover:text-primary',
                  route.active
                     ? 'font-semibold'
                     : 'font-light text-muted-foreground'
               )}
            >
               {route.label}
            </Link>
         ))}
      </nav>
   )
}
