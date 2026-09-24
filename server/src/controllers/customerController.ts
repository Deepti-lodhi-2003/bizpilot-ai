import mongoose from "mongoose";
import { type Response } from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { type UserRequest } from "../middleware/userRequest.js";

// ======================================
// GET ALL CUSTOMERS
// ======================================
export const getAllCustomers = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { search, status } = req.query;

    // Fetch non-owner users
    const users = await User.find({ role: { $ne: "owner" } })
      .select("-password")
      .sort({ createdAt: -1 });

    // Fetch all orders for fast in-memory aggregation
    const allOrders = await Order.find().sort({ createdAt: -1 });

    // Group orders by userId string
    const ordersByUser: Record<string, typeof allOrders> = {};
    for (const order of allOrders) {
      const userIdStr = order.user?.toString();
      if (userIdStr) {
        if (!ordersByUser[userIdStr]) {
          ordersByUser[userIdStr] = [];
        }
        ordersByUser[userIdStr].push(order);
      }
    }

    // Map users to enriched customer data
    let customers = users.map((user) => {
      const userOrders = ordersByUser[user._id.toString()] || [];
      const totalOrders = userOrders.length;

      const totalSpent = userOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

      const latestOrder = userOrders[0];
      const lastOrderDate = latestOrder ? latestOrder.createdAt : null;
      const phone = latestOrder?.shippingAddress?.phone || "-";
      const city = latestOrder?.shippingAddress?.city || "-";
      const state = latestOrder?.shippingAddress?.state || "-";

      const customerStatus = totalOrders > 0 ? "active" : "inactive";

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone,
        city,
        state,
        totalOrders,
        totalSpent,
        lastOrderDate,
        status: customerStatus,
        createdAt: (user as any).createdAt,
      };
    });

    // Filter by search keyword (name, email, phone)
    if (search && typeof search === "string" && search.trim() !== "") {
      const searchLower = search.toLowerCase().trim();
      customers = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.phone?.includes(searchLower)
      );
    }

    // Filter by status (active / inactive)
    if (status && typeof status === "string" && status !== "All") {
      customers = customers.filter(
        (c) => c.status.toLowerCase() === status.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get all customers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET CUSTOMER STATS
// ======================================
export const getCustomerStats = async (
  _req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({ role: { $ne: "owner" } });
    const orders = await Order.find();

    const totalCustomers = users.length;

    // Set of user IDs who placed at least one order
    const activeUserIds = new Set(
      orders.map((o) => o.user?.toString()).filter(Boolean)
    );

    const activeCustomers = users.filter((u) =>
      activeUserIds.has(u._id.toString())
    ).length;

    const totalOrders = orders.length;

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        activeCustomers,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get customer stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET SINGLE CUSTOMER BY ID (WITH ORDERS)
// ======================================
export const getCustomerById = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
      return;
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
      return;
    }

    // Fetch customer's orders
    const orders = await Order.find({
      user: new mongoose.Types.ObjectId(id as string),
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;

    const totalSpent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered"
    ).length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled"
    ).length;

    const latestOrder = orders[0];
    const phone = latestOrder?.shippingAddress?.phone || "-";
    const address = latestOrder?.shippingAddress || null;

    res.status(200).json({
      success: true,
      customer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone,
        address,
        createdAt: (user as any).createdAt,
        metrics: {
          totalOrders,
          totalSpent,
          avgOrderValue,
          deliveredOrders,
          pendingOrders,
          cancelledOrders,
        },
      },
      orders,
    });
  } catch (error) {
    console.error("Get customer by id error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
