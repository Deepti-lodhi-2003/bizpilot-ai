import axios from "axios";
import type { Order } from "./orderService";

const API_URL = "http://localhost:5000/api/auth";

// ======================================
// CUSTOMER TYPES
// ======================================

export interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface CustomerMetrics {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

export interface CustomerDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: {
    fullName?: string;
    phone?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
  createdAt: string;
  metrics: CustomerMetrics;
}

export interface CustomerDetailResponse {
  success: boolean;
  customer: CustomerDetail;
  orders: Order[];
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
// GET ALL CUSTOMERS
// ======================================

export const getAllCustomers = async (
  search?: string,
  status?: string
): Promise<Customer[]> => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (status && status !== "All") params.status = status;

  const response = await axios.get(`${API_URL}/admin/customers`, {
    headers: getAuthHeaders(),
    params,
  });

  return response.data.customers;
};

// ======================================
// GET CUSTOMER STATS
// ======================================

export const getCustomerStats = async (): Promise<CustomerStats> => {
  const response = await axios.get(`${API_URL}/admin/customers/stats`, {
    headers: getAuthHeaders(),
  });

  return response.data.stats;
};

// ======================================
// GET CUSTOMER BY ID
// ======================================

export const getCustomerById = async (
  id: string
): Promise<CustomerDetailResponse> => {
  const response = await axios.get(`${API_URL}/admin/customers/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};
