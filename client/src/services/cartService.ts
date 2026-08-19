import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:5000/api/auth";

export interface CartItem {
  _id: string;
  user: string;
  product: Product;
  quantity: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// GET CART

export const getCart = async (): Promise<CartItem[]> => {
  const response = await axios.get(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
  });

  return response.data.cart;
};

// ADD TO CART

export const addToCart = async (
  product: string,
  quantity: number = 1
): Promise<CartItem> => {
  const response = await axios.post(
    `${API_URL}/cart`,
    {
      product,
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.cart;
};

// UPDATE QUANTITY

export const updateCartQuantity = async (
  id: string,
  quantity: number
): Promise<CartItem> => {
  const response = await axios.put(
    `${API_URL}/cart/${id}`,
    {
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.cart;
};


// REMOVE FROM CART

export const removeFromCart = async (
  id: string
): Promise<void> => {
  await axios.delete(`${API_URL}/cart/${id}`, {
    headers: getAuthHeaders(),
  });
};

// CLEAR CART

export const clearCart = async (): Promise<void> => {
  await axios.delete(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
  });
};