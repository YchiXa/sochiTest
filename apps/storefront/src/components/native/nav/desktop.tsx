'use client'

import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { forwardRef } from 'react'

const components: { title: string; href: string; description: string }[] = [
   {
      title: 'Диалоговое окно',
      href: '/docs/primitives/alert-dialog',
      description:
         'Модальное окно, которое прерывает пользователя важным контентом и ожидает ответа.',
   },
]

export function MainNav() {
   return (
      <div className="hidden md:flex gap-4">
         <Link href="/" className="flex items-center">
            <span className="hidden font-medium sm:inline-block">
               {config.name}
            </span>
         </Link>
         <NavMenu />
      </div>
   )
}

export function NavMenu() {
   return (
      <NavigationMenu>
         <NavigationMenuList>
            <NavigationMenuItem>
               <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <div className="font-normal text-foreground/70">
                        Товары
                     </div>
                  </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">
                     Категории
                  </div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                     <li className="row-span-3">
                        <NavigationMenuLink asChild>
                           <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                           >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                 shadcn/ui
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                 Красиво оформленные компоненты, созданные с
                                 использованием Radix UI и Tailwind CSS.
                              </p>
                           </Link>
                        </NavigationMenuLink>
                     </li>
                     <ListItem href="/docs" title="Введение">
                        Повторно используемые компоненты, созданные с
                        использованием Radix UI и Tailwind CSS.
                     </ListItem>
                     <ListItem href="/docs/installation" title="Установка">
                        Как установить зависимости и структурировать ваше
                        приложение.
                     </ListItem>
                     <ListItem
                        href="/docs/primitives/typography"
                        title="Типография"
                     >
                        Стили для заголовков, абзацев, списков и т.д.
                     </ListItem>
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">Бренды</div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                     {components.map((component) => (
                        <ListItem
                           key={component.title}
                           title={component.title}
                           href={component.href}
                        >
                           {component.description}
                        </ListItem>
                     ))}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
         </NavigationMenuList>
      </NavigationMenu>
   )
}

const ListItem = forwardRef<
   React.ElementRef<'a'>,
   React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <Link
               href={href}
               ref={ref}
               className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  className
               )}
               {...props}
            >
               <div className="text-sm font-medium leading-none">{title}</div>
               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
})

ListItem.displayName = 'ListItem'
