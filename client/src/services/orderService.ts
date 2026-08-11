import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export interface OrderProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  user: OrderUser;
  product: OrderProduct;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Get all orders for dashboard
export const getAllOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/admin/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.orders;
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/orders/${orderId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.order;
};