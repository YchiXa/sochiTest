'use client'

import { Spinner } from '@/components/native/icons'
import { Button } from '@/components/ui/button'
import { getCountInCart } from '@/lib/cart'
import { useCartContext } from '@/state/Cart'
import { MinusIcon, PlusIcon, ShoppingBasketIcon, X } from 'lucide-react'

export default function CartButton({ product }) {
   return <ButtonComponent product={product} />
}

export function ButtonComponent({ product }) {
   const { cart, fetchingCart, onAddToCart, onRemoveFromCart } =
      useCartContext()

   if (fetchingCart)
      return (
         <Button disabled>
            <Spinner />
         </Button>
      )

   const count = getCountInCart({
      cartItems: cart?.items,
      productId: product?.id,
   })

   if (count === 0) {
      return (
         <Button className="flex gap-2" onClick={() => onAddToCart(product)}>
            <ShoppingBasketIcon className="h-4" /> Add to Cart
         </Button>
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
               {count == 1 ? (
                  <X className="h-4 w-4" />
               ) : (
                  <MinusIcon className="h-4 w-4" />
               )}
            </Button>

            <Button disabled variant="outline" size="icon">
               {count}
            </Button>
            <Button
               variant="outline"
               size="icon"
               onClick={() => onAddToCart(product)}
            >
               <PlusIcon className="h-4 w-4" />
            </Button>
         </>
      )
   }
}
