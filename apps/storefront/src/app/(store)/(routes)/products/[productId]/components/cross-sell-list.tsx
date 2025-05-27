'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartContext } from '@/state/Cart'
import { Product } from '@prisma/client'
import Link from 'next/link'

export type CrossSellProductsListProps = {
   products: Product[]
}

export function CrossSellProductsList({
   products,
}: CrossSellProductsListProps) {
   const { onAddToCart, onRemoveFromCart, countProductsInCart, fetchingCart } =
      useCartContext()

   return (
      <div className="p-6">
         <h2 className="font-medium text-xl py-4">You might also like</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
               <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-4 flex flex-col justify-between h-full relative">
                     <div>
                        <Link href={`/products/${product.id}`}>
                           <img
                              src={product.images[0] ?? ''}
                              alt={product.title}
                              className="w-full h-60 object-cover object-center rounded-md mb-3"
                           />
                        </Link>
                        <h3 className="font-semibold text-lg mb-2">
                           {product.title}
                        </h3>
                        <p className="text-xl font-bold mb-3">
                           ${product.price}
                        </p>

                        {countProductsInCart(product) ? (
                           <Badge className="my-2 text-[14px] absolute top-2 left-4">
                              ({countProductsInCart(product)})
                           </Badge>
                        ) : (
                           <></>
                        )}
                     </div>

                     <div>
                        <Button
                           className="w-full"
                           disabled={fetchingCart}
                           onClick={() => {
                              onAddToCart(product)
                           }}
                        >
                           Add to Cart
                        </Button>
                        <Button
                           className="w-full mt-2 block"
                           variant="outline"
                           disabled={
                              fetchingCart || countProductsInCart(product) === 0
                           }
                           onClick={() => {
                              onRemoveFromCart(product)
                           }}
                        >
                           Remove from Cart
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   )
}
