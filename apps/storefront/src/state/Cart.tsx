'use client'

import { useToast } from '@/hooks/use-toast'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { getCountInCart, getLocalCart, writeLocalCart } from '@/lib/cart'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import { Product } from '@prisma/client'
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext({
   cart: null,
   loading: true,
   fetchingCart: false,
   refreshCart: () => {},
   dispatchCart: (object) => {},
   onAddToCart: (product: Product) => {},
   onRemoveFromCart: (product: Product) => {},
})

export const useCartContext = () => {
   return useContext(CartContext)
}

export const CartContextProvider = ({ children }) => {
   const { user } = useUserContext()
   const { authenticated } = useAuthenticated()
   const [cart, setCart] = useState(null)
   const [loading, setLoading] = useState(true)
   const [fetchingCart, setFetchingCart] = useState(false)
   const { toast } = useToast()

   const dispatchCart = async (cart) => {
      setCart(cart)
      writeLocalCart(cart)
   }

   const refreshCart = async () => {
      setLoading(true)

      if (isVariableValid(user)) {
         setCart(user?.cart)
         writeLocalCart(user?.cart)
      }
      if (!isVariableValid(user)) setCart(getLocalCart())

      setLoading(false)
   }

   function findLocalCartIndexById(array, productId) {
      for (let i = 0; i < array.length; i++) {
         if (array?.items[i]?.productId === productId) {
            return i
         }
      }
      return -1
   }

   async function onAddToCart(product: Product) {
      try {
         setFetchingCart(true)

         const count = getCountInCart({
            cartItems: cart?.items,
            productId: product?.id,
         })

         if (authenticated) {
            const response = await fetch(`/api/cart`, {
               method: 'POST',
               body: JSON.stringify({
                  productId: product?.id,
                  count:
                     getCountInCart({
                        cartItems: cart?.items,
                        productId: product?.id,
                     }) + 1,
               }),
               cache: 'no-store',
               headers: {
                  'Content-Type': 'application/json-string',
               },
            })

            const json = await response.json()

            dispatchCart(json)
         }

         const localCart = getLocalCart() as any

         if (!authenticated && count > 0) {
            for (let i = 0; i < localCart.items.length; i++) {
               if (localCart.items[i].productId === product?.id) {
                  localCart.items[i].count = localCart.items[i].count + 1
               }
            }

            dispatchCart(localCart)
         }

         if (!authenticated && count < 1) {
            localCart.items.push({
               productId: product?.id,
               product,
               count: 1,
            })

            dispatchCart(localCart)
         }

         setFetchingCart(false)
         toast({
            title: 'New Product Added To Cart',
            description: `"${product.title}" was added to the Cart`,
         })
      } catch (error) {
         console.error({ error })
      }
   }

   async function onRemoveFromCart(product: Product) {
      try {
         setFetchingCart(true)

         const count = getCountInCart({
            cartItems: cart?.items,
            productId: product?.id,
         })

         if (authenticated) {
            const response = await fetch(`/api/cart`, {
               method: 'POST',
               body: JSON.stringify({
                  productId: product?.id,
                  count:
                     getCountInCart({
                        cartItems: cart?.items,
                        productId: product?.id,
                     }) - 1,
               }),
               cache: 'no-store',
               headers: {
                  'Content-Type': 'application/json-string',
               },
            })

            const json = await response.json()

            dispatchCart(json)
         }

         const localCart = getLocalCart() as any
         const index = findLocalCartIndexById(localCart, product?.id)

         if (!authenticated && count > 1) {
            for (let i = 0; i < localCart.items.length; i++) {
               if (localCart.items[i].productId === product?.id) {
                  localCart.items[i].count = localCart.items[i].count - 1
               }
            }

            dispatchCart(localCart)
         }

         if (!authenticated && count === 1) {
            localCart.items.splice(index, 1)

            dispatchCart(localCart)
         }

         setFetchingCart(false)
      } catch (error) {
         console.error({ error })
      }
   }

   useEffect(() => {
      if (isVariableValid(user)) {
         setCart(user?.cart)
         writeLocalCart(user?.cart)
      }
      if (!isVariableValid(getLocalCart())) writeLocalCart({ items: [] })
      if (!isVariableValid(user)) setCart(getLocalCart())

      setLoading(false)
   }, [user])

   return (
      <CartContext.Provider
         value={{
            cart,
            loading,
            refreshCart,
            dispatchCart,
            fetchingCart,
            onAddToCart,
            onRemoveFromCart,
         }}
      >
         {children}
      </CartContext.Provider>
   )
}
