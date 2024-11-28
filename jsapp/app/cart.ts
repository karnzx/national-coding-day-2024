/**
PRODUCTS:
{
  "id": 1,
  "products": [
    {
      "id": 168,
      "title": "Charger SXT RWD",
      "price": 999.99,
      "quantity": 3,
      "subtotal": 2999.97,
      "discountPercentage": 10.00,
      "discountedTotal": 2699.97,
      "thumbnail": "https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/thumbnail.png"
    },{
      "id": 169,
      "title": "Charger GT RWD",
      "price": 1099.99,
      "quantity": 2,
      "subtotal": 2199.98,
      "discountPercentage": 10.00,
      "discountedTotal": 1979.98,
      "thumbnail": "https://cdn.dummyjson.com/products/images/vehicle/Charger%20GT%20RWD/thumbnail.png"
    },
   ],
   "totalPrice": 4699.95,
   "totalDiscounted": 4679.95,
   "totalProducts": 2,
   "totalItems": 5
 }
 * */

export function subtotalPrice(price: number, quantity: number): number {
  return price * quantity;
}

export function totalPrice(products: any[]): number {
  return products.reduce((acc, product) => acc + product.subtotal, 0);
}

export function discountedPrice(price: number, discount: number): number {
  return price - price * discount / 100;
}

export function totalProducts(products: any[]): number {
  return products.length;
}

export function totalItems(products: any[]): number {
  return products.reduce((acc, product) => acc + product.quantity, 0);
}

export function totalDiscounted(products: any[]): number {
  return products.reduce((acc, product) => acc + product.discountedTotal, 0);
}
