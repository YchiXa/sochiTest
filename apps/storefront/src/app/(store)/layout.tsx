import { SearchMenu } from '@/components/composites/search-menu'
import Footer from '@/components/native/Footer'
import Header from '@/components/native/nav/parent'
import prisma from '@/lib/prisma'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const categories = (await prisma.category.findMany()).map(
      (category) => category.title
   )
   const brands = (await prisma.brand.findMany()).map((brand) => brand.title)
   return (
      <>
         <Header>
            <SearchMenu categories={categories} brands={brands} />
         </Header>
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            {children}
         </div>
         <Footer />
      </>
   )
}
