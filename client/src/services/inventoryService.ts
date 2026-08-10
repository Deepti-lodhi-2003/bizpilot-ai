import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:5000/api/auth";

export interface InventoryHistory {
  _id: string;

  product: {
    _id: string;
    name: string;
    category: string;
  };

  type: "add" | "remove";

  quantity: number;

  previousStock: number;

  newStock: number;

  performedBy: {
    _id: string;
    name: string;
    email: string;
  };

  createdAt: string;
}

// Get inventory
export const getInventory = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/inventory`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.products;
};

// Add stock
export const addStock = async (
  productId: string,
  quantity: number
): Promise<Product> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/inventory/${productId}/add`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.product;
};

// Remove stock
export const removeStock = async (
  productId: string,
  quantity: number
): Promise<Product> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/inventory/${productId}/remove`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.product;
};

// Get inventory history
export const getInventoryHistory = async (
  productId: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/inventory/${productId}/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.history;
};


