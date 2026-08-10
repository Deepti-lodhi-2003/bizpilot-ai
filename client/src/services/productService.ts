import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:5000/api/auth";

// GET PRODUCTS

export const getProducts = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.products;
};

// CREATE PRODUCT

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export const createProduct = async (
  productData: CreateProductData
): Promise<Product> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/products`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.product;
};

// UPDATE PRODUCT 

export const updateProduct = async (
  id: string,
  productData: CreateProductData
): Promise<Product> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/products/${id}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.product;
};

// DELETE PRODUCT

export const deleteProduct = async (
  id: string
): Promise<void> => {
  const token = localStorage.getItem("token");

  await axios.delete(
    `${API_URL}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};