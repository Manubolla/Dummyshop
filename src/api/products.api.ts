import { ProductCategory } from "../data/types/category";
import { Product, ProductResponse } from "../data/types/product";

const BASE_URL = 'https://dummyjson.com/products';

export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: ProductResponse = await res.json();
  return data.products;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product with ID ${id}`);
  return await res.json();
};

export const fetchCategories = async (): Promise<ProductCategory[]> => {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
};

export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const res = await fetch(`${BASE_URL}/category/${category}`);
  if (!res.ok) throw new Error(`Failed to fetch products for category ${category}`);
  const data: ProductResponse = await res.json();
  return data.products;
};
