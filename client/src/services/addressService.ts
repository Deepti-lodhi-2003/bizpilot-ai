import axios from "axios";

const API_URL =
  "http://localhost:5000/api/auth";

export interface Address {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(
    "token"
  )}`,
});

export const getMyAddresses = async (): Promise<
  Address[]
> => {
  const response = await axios.get(
    `${API_URL}/addresses`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.addresses;
};

export const addAddress = async (
  data: Omit<
    Address,
    "_id" | "user" | "isDefault"
  > & {
    isDefault?: boolean;
  }
): Promise<Address> => {
  const response = await axios.post(
    `${API_URL}/addresses`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.address;
};

export const updateAddress = async (
  id: string,
  data: Partial<Address>
): Promise<Address> => {
  const response = await axios.put(
    `${API_URL}/addresses/${id}`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.address;
};

export const deleteAddress = async (
  id: string
) => {
  await axios.delete(
    `${API_URL}/addresses/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
};

export const setDefaultAddress = async (
  id: string
): Promise<Address> => {
  const response = await axios.put(
    `${API_URL}/addresses/${id}/default`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.address;
};