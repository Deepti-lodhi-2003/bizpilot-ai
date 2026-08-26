import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:5000/api/auth";

// ======================================
// SHIPPING ADDRESS
// ======================================

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

// ======================================
// ORDER ITEM PAYLOAD
// ======================================

export interface OrderItemPayload {
  product: string;
  quantity: number;
}

// ======================================
// CREATE ORDER PAYLOAD
// ======================================

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  shippingAddress: ShippingAddress;
}

// ======================================
// USER
// ======================================

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

// ======================================
// ORDER ITEM
// ======================================

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

// ======================================
// ORDER STATUS
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

  items: OrderItem[];

  totalAmount: number;

  shippingAddress: ShippingAddress;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}

// ======================================
// AUTH HEADERS
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

export const createOrder = async (
  data: CreateOrderPayload
): Promise<Order> => {
  const response = await axios.post(
    `${API_URL}/orders`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.order;
};

// ======================================
// GET MY ORDERS
// ======================================

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axios.get(
    `${API_URL}/orders`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.orders;
};

// ======================================
// GET SINGLE ORDER
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
// UPDATE STATUS
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
// GET ALL ORDERS
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