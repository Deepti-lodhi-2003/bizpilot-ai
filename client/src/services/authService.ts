import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      data
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Login failed"
      );
    }

    throw new Error("Something went wrong");
  }
};


interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      data
    );

    return response.data;
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }

    throw new Error("Something went wrong");
  }
};