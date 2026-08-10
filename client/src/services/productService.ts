import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:5000/api/auth";

export const getProducts = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.products;
};


export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export const createProduct = async (
  productData: Omit<Product, "_id">
): Promise<Product> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/product`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.product;
};