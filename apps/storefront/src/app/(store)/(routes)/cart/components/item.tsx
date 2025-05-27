'use client'

import { Spinner } from '@/components/native/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getCountInCart } from '@/lib/cart'
import { useCartContext } from '@/state/Cart'
import { ProductWithCrossSell } from '@/types/prisma'
import { Product } from '@prisma/client'
import { MinusIcon, PlusIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export type ItemProps = {
   cartItem: {
      product: ProductWithCrossSell
      productId: string
      count: number
   }
}

export const Item = ({ cartItem }: ItemProps) => {
   const { product, productId } = cartItem
   const { cart, fetchingCart, onAddToCart, onRemoveFromCart } =
      useCartContext()

   function CartButton() {
      const count = getCountInCart({
         cartItems: cart?.items,
         productId,
      })

      if (fetchingCart)
         return (
            <Button disabled>
               <Spinner />
            </Button>
         )

      if (count === 0) {
         return (
            <Button onClick={() => onAddToCart(product)}>🛒 Add to Cart</Button>
         )
      }

      if (count > 0) {
         return (
            <>
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveFromCart(product)}
               >
                  {count === 1 ? (
                     <X className="h-4" />
                  ) : (
                     <MinusIcon className="h-4" />
                  )}
               </Button>
               <Button disabled variant="ghost" size="icon">
                  {count}
               </Button>
               <Button
                  disabled={productId == ''}
                  variant="outline"
                  size="icon"
                  onClick={() => onAddToCart(product)}
               >
                  <PlusIcon className="h-4" />
               </Button>
            </>
         )
      }
   }

   function showPrice(product: Product) {
      if (product?.discount > 0) {
         const price = product?.price - product?.discount
         const percentage = (product?.discount / product?.price) * 100
         return (
            <div className="flex gap-2 items-center">
               <Badge className="flex gap-4" variant="destructive">
                  <div className="line-through">${product?.price}</div>
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="">${price.toFixed(2)}</h2>
            </div>
         )
      }

      return <h2>${product?.price}</h2>
   }

   function crossSellPrice(product: Product) {
      if (product?.discount > 0) {
         const price = product?.price - product?.discount
         const percentage = (product?.discount / product?.price) * 100
         return (
            <div className="flex flex-col items-start gap-2">
               <Badge className="flex gap-4" variant="destructive">
                  <div className="line-through">${product?.price}</div>
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="">${price.toFixed(2)}</h2>
            </div>
         )
      }

      return <h2>${product?.price}</h2>
   }

   return (
      <Card className="p-4">
         <Card>
            <CardHeader className="p-0 md:hidden">
               <div className="relative h-32 w-full">
                  <Link href={`/products/${product?.id}`}>
                     <Image
                        className="rounded-t-lg"
                        src={product?.images[0]}
                        alt="product image"
                        fill
                        sizes="(min-width: 1000px) 30vw, 50vw"
                        style={{ objectFit: 'cover' }}
                     />
                  </Link>
               </div>
            </CardHeader>
            <CardContent className="grid grid-cols-6 gap-4 p-3">
               <div className="relative w-full col-span-2 hidden md:inline-flex">
                  <Link href={`/products/${product?.id}`}>
                     <Image
                        className="rounded-lg"
                        src={product?.images[0]}
                        alt="item image"
                        fill
                        style={{ objectFit: 'cover' }}
                     />
                  </Link>
               </div>
               <div className="col-span-4 block space-y-2">
                  <Link href={`/products/${product?.id}`}>
                     <h2>{product?.title}</h2>
                  </Link>
                  <p className="text-xs text-muted-foreground text-justify">
                     {product?.description}
                  </p>
                  {showPrice(product)}
                  <CartButton />
               </div>
            </CardContent>
         </Card>

         {product?.crossSells?.length > 0 && (
            <Card className="my-4">
               <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                     You might also like
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                     {product.crossSells.map((crossSellProduct) => (
                        <div
                           key={crossSellProduct.id}
                           className="border rounded-lg p-3 space-y-2 relative"
                        >
                           <div className="relative h-20 w-full">
                              <Link href={`/products/${crossSellProduct.id}`}>
                                 <Image
                                    className="rounded"
                                    src={
                                       crossSellProduct.images[0] ||
                                       '/placeholder.svg'
                                    }
                                    alt={crossSellProduct.title}
                                    fill
                                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                 />
                              </Link>
                           </div>
                           <div className="space-y-1">
                              <Link href={`/products/${crossSellProduct.id}`}>
                                 <h4
                                    className="text-sm font-medium hover:underline overflow-hidden"
                                    style={{
                                       display: '-webkit-box',
                                       WebkitLineClamp: 2,
                                       WebkitBoxOrient: 'vertical',
                                    }}
                                 >
                                    {crossSellProduct.title}
                                 </h4>
                              </Link>
                              {crossSellPrice(crossSellProduct)}
                              <div className="flex items-center gap-x-1">
                                 <Button
                                    size="sm"
                                    onClick={() =>
                                       onAddToCart(crossSellProduct)
                                    }
                                 >
                                    Add to Cart
                                 </Button>

                                 <Button
                                    size="sm"
                                    className="p-4"
                                    variant="outline"
                                    onClick={() =>
                                       onRemoveFromCart(crossSellProduct)
                                    }
                                 >
                                    Remove from Cart
                                 </Button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}
      </Card>
   )
}
