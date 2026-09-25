import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
  description?: string;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axios.get(`${API_URL}/expenses`, {
    headers: getAuthHeaders(),
  });
  return response.data.expenses;
};

export const createExpense = async (data: Partial<Expense>): Promise<Expense> => {
  const response = await axios.post(`${API_URL}/expenses`, data, {
    headers: getAuthHeaders(),
  });
  return response.data.expense;
};

export const updateExpense = async (id: string, data: Partial<Expense>): Promise<Expense> => {
  const response = await axios.put(`${API_URL}/expenses/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/expenses/${id}`, {
    headers: getAuthHeaders(),
  });
};
