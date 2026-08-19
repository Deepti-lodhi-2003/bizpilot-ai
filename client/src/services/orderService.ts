import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:5000/api/auth";

// ======================================
// USER
// ======================================

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

// ======================================
// STATUS
// ======================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

// ======================================
// ORDER
// ======================================

export interface Order {
  _id: string;
  user: OrderUser;
  product: Product;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;

  shippingAddress: ShippingAddress;

  createdAt: string;
  updatedAt: string;
}

// ======================================
// AUTH
// ======================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================
// CREATE ORDER
// ======================================

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export const createOrder = async (
  product: string,
  quantity: number,
  shippingAddress: ShippingAddress
): Promise<Order> => {
  const response = await axios.post(
    `${API_URL}/order`,
    {
      product,
      quantity,
      shippingAddress,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.order;
};

// ======================================
// MY ORDERS
// ======================================

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });

  return response.data.orders;
};

// ======================================
// SINGLE ORDER
// ======================================

export const getOrderById = async (
  id: string
): Promise<Order> => {
  const response = await axios.get(
    `${API_URL}/orders/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.order;
};

// ======================================
// CANCEL ORDER
// ======================================

export const cancelOrder = async (
  id: string
): Promise<Order> => {
  const response = await axios.put(
    `${API_URL}/orders/${id}/cancel`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.order;
};

// ======================================
// UPDATE STATUS - ADMIN
// ======================================

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<Order> => {
  const response = await axios.put(
    `${API_URL}/orders/${id}/status`,
    {
      status,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.order;
};

// ======================================
// ALL ORDERS - ADMIN
// ======================================

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await axios.get(
    `${API_URL}/admin/orders`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.orders;
};