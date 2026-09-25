export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  description: string;
  status: 'Paid' | 'Pending';
  createdAt?: string;
}
