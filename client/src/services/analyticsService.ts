import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export interface AnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  monthlyData: {
    month: string;
    revenue: number;
    expenses: number;
  }[];
  expenseByCategory: Record<string, number>;
  orderStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await axios.get(`${API_URL}/analytics`, {
    headers: getAuthHeaders(),
  });
  return response.data.analytics;
};
