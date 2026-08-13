import axios from "axios";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "http://localhost:5000/api/auth";

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/categories`);

  return response.data.categories;
};