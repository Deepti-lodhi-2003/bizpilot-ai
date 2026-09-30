import Order from "../models/Order.js";
import Expense from "../models/Expense.js";

// ======================================
// GET ANALYTICS
// ======================================

export const getAnalyticsData = async () => {
  // ==================================
  // ORDERS
  // ==================================

  const orders = await Order.find()
    .populate('user', 'name')
    .populate('items.product', 'name')
    .sort({ createdAt: -1 });

  const recentOrders = orders.slice(0, 5).map(order => ({
    id: `#ORD-${order._id.toString().slice(-4).toUpperCase()}`,
    customer: (order.user as any)?.name || 'Unknown Customer',
    product: (order.items[0]?.product as any)?.name || 'Unknown Product',
    amount: `₹${order.totalAmount.toLocaleString()}`,
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }));

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
  // AI INSIGHTS
  // ==================================
  let revenueInsight = { type: "info", title: "No revenue change", description: "Not enough data.", icon: "bi-graph-up" };
  if (monthlyData.length >= 2) {
    const lastMonthRev = monthlyData[4].revenue;
    const thisMonthRev = monthlyData[5].revenue;
    if (lastMonthRev > 0) {
      const growth = ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1);
      revenueInsight = {
        type: thisMonthRev > lastMonthRev ? "positive" : "warning",
        title: thisMonthRev > lastMonthRev ? "Revenue is growing" : "Revenue is down",
        description: `Your revenue ${thisMonthRev > lastMonthRev ? "increased" : "decreased"} by ${Math.abs(Number(growth))}% compared to last month.`,
        icon: thisMonthRev > lastMonthRev ? "bi-graph-up-arrow" : "bi-graph-down-arrow",
      };
    }
  }

  let expenseInsight = { type: "info", title: "No expense change", description: "Not enough data.", icon: "bi-wallet2" };
  if (monthlyData.length >= 2) {
    const lastMonthExp = monthlyData[4].expenses;
    const thisMonthExp = monthlyData[5].expenses;
    if (lastMonthExp > 0) {
      const growth = ((thisMonthExp - lastMonthExp) / lastMonthExp * 100).toFixed(1);
      expenseInsight = {
        type: thisMonthExp > lastMonthExp ? "warning" : "positive",
        title: thisMonthExp > lastMonthExp ? "Expenses increased" : "Expenses decreased",
        description: `Your expenses are ${Math.abs(Number(growth))}% ${thisMonthExp > lastMonthExp ? "higher" : "lower"} than last month.`,
        icon: "bi-exclamation-triangle",
      };
    }
  }

  const orderInsight = {
    type: "info",
    title: "Orders are performing well",
    description: `You received ${totalOrders} orders in total.`,
    icon: "bi-lightbulb",
  };

  const insights = [revenueInsight, expenseInsight, orderInsight];

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
    recentOrders,
    insights
  };
};
