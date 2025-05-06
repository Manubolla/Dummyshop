import { Product as APIProduct } from '../types/product';

export interface ProductModel {
  id: number;
  title: string;
  price: string;
  rating: number;
  thumbnail: string;
  description: string;
  brand: string;
  stock: number;
  category: string;
}

export const mapProductFromApi = (product: APIProduct): ProductModel => ({
  id: product.id,
  title: product.title,
  price: `$${product.price.toFixed(2)}`,
  rating: product.rating,
  thumbnail: product.thumbnail,
  description: product.description,
  brand: product.brand,
  stock: product.stock,
  category: product.category,
});

export const mapProductsFromApi = (products: APIProduct[]): ProductModel[] =>
  products.map(mapProductFromApi);
