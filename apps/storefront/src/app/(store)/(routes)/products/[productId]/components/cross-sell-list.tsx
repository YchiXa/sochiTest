import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export type ProductItem = {
   id: string
   title: string
   image: string
   price: number
}

export type CrossSellProductsListProps = {
   products: ProductItem[]
}

export function CrossSellProductsList({
   products,
}: CrossSellProductsListProps) {
   return (
      <div className="p-6">
         <h2 className="font-medium text-xl py-4">You might also like</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
               <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-4">
                     <img
                        src={product.image ?? ''}
                        alt={product.title}
                        className="w-full h-60 object-cover object-center rounded-md mb-3"
                     />
                     <h3 className="font-semibold text-lg mb-2">
                        {product.title}
                     </h3>
                     <p className="text-xl font-bold mb-3">${product.price}</p>
                     <Button className="w-full">Add to Cart</Button>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   )
}
