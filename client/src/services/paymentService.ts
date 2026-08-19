import axios from "axios";

const API_URL =
  "http://localhost:5000/api/auth";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
}

export const createPaymentOrder = async (
  orderId: string
): Promise<RazorpayOrder> => {
  const response = await axios.post(
    `${API_URL}/payment/create-order`,
    {
      orderId,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.order;
};

export const verifyPayment = async (
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const response = await axios.post(
    `${API_URL}/payment/verify`,
    paymentData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};