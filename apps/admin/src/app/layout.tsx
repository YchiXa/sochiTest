import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   title: 'Панель администратора',
   description: 'Панель управления интернет-магазином',
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="ru" suppressHydrationWarning>
         <body className={inter.className} suppressHydrationWarning>
           <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ToastProvider />
              <ModalProvider />
              {children}
           </ThemeProvider>
         </body>
      </html>
   )
}
