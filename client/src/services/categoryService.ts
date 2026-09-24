import axios from "axios";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image?: string;
}

const API_URL = "http://localhost:5000/api/auth";

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(
    `${API_URL}/categories`
  );

  return response.data.categories || [];
};

export const createCategory = async (
  categoryData: CategoryFormData
): Promise<Category> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/categories`,
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.category;
};

export const updateCategory = async (
  id: string,
  categoryData: CategoryFormData
): Promise<Category> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/categories/${id}`,
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");

  await axios.delete(`${API_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};