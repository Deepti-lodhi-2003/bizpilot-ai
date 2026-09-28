import Order from "../models/Order.js";
import Expense from "../models/Expense.js";

// ======================================
// GET ANALYTICS
// ======================================

export const getAnalyticsData = async () => {
  // ==================================
  // ORDERS
  // ==================================

  const orders = await Order.find();

  // Total orders
  const totalOrders = orders.length;

  // Delivered orders revenue
  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce(
      (total, order) => total + order.totalAmount,
      0
    );

  // ==================================
  // EXPENSES
  // ==================================

  const expenses = await Expense.find();

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // ==================================
  // NET PROFIT
  // ==================================

  const netProfit =
    totalRevenue - totalExpenses;

  // ==================================
  // ORDER STATUS
  // ==================================

  const orderStatus = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((order) => {
    if (order.status in orderStatus) {
      orderStatus[
        order.status as keyof typeof orderStatus
      ]++;
    }
  });

  // ==================================
  // EXPENSE BY CATEGORY
  // ==================================

  const expenseByCategory: Record<
    string,
    number
  > = {};

  expenses.forEach((expense) => {
    const current = expenseByCategory[expense.category] || 0;
    expenseByCategory[expense.category] = current + expense.amount;
  });

  // ==================================
  // LAST 6 MONTHS
  // ==================================

  const monthlyData: {
    month: string;
    revenue: number;
    expenses: number;
  }[] = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthName = date.toLocaleString(
      "en-US",
      {
        month: "short",
      }
    );

    // Monthly revenue
    const monthlyRevenue = orders
      .filter((order) => {
        const orderDate = new Date(
          order.createdAt
        );

        return (
          order.status === "delivered" &&
          orderDate.getFullYear() === year &&
          orderDate.getMonth() === month
        );
      })
      .reduce(
        (total, order) =>
          total + order.totalAmount,
        0
      );

    // Monthly expenses
    const monthlyExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(
          expense.date
        );

        return (
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() === month
        );
      })
      .reduce(
        (total, expense) =>
          total + expense.amount,
        0
      );

    monthlyData.push({
      month: monthName,
      revenue: monthlyRevenue,
      expenses: monthlyExpenses,
    });
  }

  // ==================================
  // RESPONSE
  // ==================================

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    totalOrders,

    monthlyData,

    expenseByCategory,

    orderStatus,
  };
};
