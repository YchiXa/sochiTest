import { NavItem } from '@/types/nav'

interface DocsConfig {
   mainNav: NavItem[]
   sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
   mainNav: [
      {
         title: 'Документация',
         href: '/docs',
      },

      {
         title: 'GitHub',
         href: 'https://github.com/sesto-dev',
         external: true,
      },
   ],
   sidebarNav: [
      {
         title: 'Товары',
         href: '/products',
      },
      {
         title: 'Блог',
         href: '/blog',
      },
      {
         title: 'Заказы',
         href: '/profile/orders',
      },
      {
         title: 'Платежи',
         href: '/profile/payments',
      },
      {
         title: 'Контакты',
         href: '/contact',
      },
      {
         title: 'О нас',
         href: '/about',
      },
   ],
}
