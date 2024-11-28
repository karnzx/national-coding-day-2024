// Product type
export type Product = {
  productName: string
  productId: string
  price: number
}

// ProductFinder interface (for searching products)
export interface ProductFinder {
  search(productName: string, productId: string): Product | null
}

// Main function to get the price of a product from the product list
export const getProductPrice = (
  productFinder: ProductFinder,
  productName: string,
  productId: string
): number | null => {
  if (!productName || !productId) {
    throw new Error("Product name and product id are required")
  }

  const product = productFinder.search(productName, productId)

  if (!product) {
    throw new Error("Product not found")
  }

  return product.price
}

