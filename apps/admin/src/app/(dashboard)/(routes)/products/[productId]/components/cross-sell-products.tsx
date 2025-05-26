'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Product } from '@prisma/client'
import Image from 'next/image'

export type CrossSellProductsProps = {
   products: Product[]
   selectedProducts: string[]
   searchTerm: string
   handleChangeSearchTerm: (value: string) => void
   handleSelectProduct: (value: string[]) => void
}

export function CrossSellProducts({
   products,
   selectedProducts,
   searchTerm,
   handleChangeSearchTerm,
   handleSelectProduct,
}: CrossSellProductsProps) {
   const handleProductSelect = (productId: string, checked: boolean) => {
      if (checked) {
         handleSelectProduct([...selectedProducts, productId])
      } else {
         handleSelectProduct(selectedProducts.filter((id) => id !== productId))
      }
   }

   const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
   )

   return (
      <div>
         <h2 className="text-2xl font-bold mb-6">Add Cross Sell Products</h2>

         <div className="mb-6">
            <Input
               type="text"
               placeholder="Search products..."
               value={searchTerm}
               onChange={(e) => handleChangeSearchTerm(e.target.value)}
               className="max-w-md"
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
               <Card
                  key={product.id}
                  className={`cursor-pointer transition-colors ${
                     selectedProducts.includes(product.id)
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                  }`}
               >
                  <CardContent className="p-4">
                     <div className="flex items-start space-x-3">
                        <Checkbox
                           checked={selectedProducts.includes(product.id)}
                           onCheckedChange={(checked) =>
                              handleProductSelect(
                                 product.id,
                                 checked as boolean
                              )
                           }
                           className="mt-1"
                        />
                        <div className="flex-1">
                           <Image
                              src={product.images[0] || '/placeholder.svg'}
                              alt={product.title}
                              width={200}
                              height={200}
                              className="w-full h-60 object-cover object-center rounded-md mb-3"
                           />
                           <h3 className="font-semibold text-sm mb-1">
                              {product.title}
                           </h3>
                           <p className="text-lg font-bold text-primary">
                              {product.price}
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
         <Button className="my-3" disabled={selectedProducts.length === 0}>
            Add Products as Cross Sell
         </Button>
         {selectedProducts.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
               <p className="text-sm text-muted-foreground">
                  Selected {selectedProducts.length} product
                  {selectedProducts.length !== 1 ? 's' : ''}
               </p>
            </div>
         )}
      </div>
   )
}
