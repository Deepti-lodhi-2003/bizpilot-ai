import mongoose from "mongoose";
import { type Response } from "express";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

import { type OrderRequest } from "../types/orderTypes.js";
import { type UserRequest } from "../middleware/userRequest.js";

// ======================================
// CREATE ORDER
// ======================================

export const createOrder = async (
  req: OrderRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      items,
      shippingAddress,
    } = req.body;

    // ==================================
    // AUTH CHECK
    // ==================================

    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ==================================
    // ITEMS VALIDATION
    // ==================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Order items are required",
      });

      return;
    }

    // ==================================
    // ADDRESS VALIDATION
    // ==================================

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.addressLine ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      res.status(400).json({
        success: false,
        message:
          "Complete shipping address is required",
      });

      return;
    }

    // ==================================
    // PREPARE ORDER ITEMS
    // ==================================

    const orderItems = [];

    let totalAmount = 0;

    for (const item of items) {
      if (
        !item.product ||
        !item.quantity ||
        item.quantity < 1
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid product or quantity",
        });

        return;
      }

      // Find product
      const existingProduct =
        await Product.findById(item.product);

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });

        return;
      }

      // Check stock
      if (
        existingProduct.stock <
        item.quantity
      ) {
        res.status(400).json({
          success: false,
          message: `${existingProduct.name} does not have enough stock`,
        });

        return;
      }

      const itemTotal =
        existingProduct.price *
        item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        product: existingProduct._id,
        quantity: item.quantity,
        price: existingProduct.price,
      });
    }

    // ==================================
    // CREATE ONE ORDER
    // ==================================

    const order = await Order.create({
      user: new mongoose.Types.ObjectId(
        req.user.userId
      ),

      items: orderItems,

      totalAmount,

      shippingAddress,

      status: "pending",
    });

    // ==================================
    // RESPONSE
    // ==================================

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET MY ORDERS
// ======================================

export const getMyOrders = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({
      user: req.user!.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET SINGLE ORDER
// ======================================

export const getOrderById = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id as string
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(
        id as string
      ),

      user: req.user!.userId,
    }).populate("items.product");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// UPDATE ORDER STATUS
// ======================================

export const updateOrderStatus = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
      });

      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        id as string
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const order =
      await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate("items.product");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET ALL ORDERS
// ======================================

export const getAllOrders = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// CANCEL ORDER
// ======================================

export const cancelOrder = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id as string
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(
        id as string
      ),

      user: req.user!.userId,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });

      return;
    }

    if (
      order.status !== "pending" &&
      order.status !== "confirmed"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled now",
      });

      return;
    }

    order.status = "cancelled";

    await order.save();

    // IMPORTANT:
    // Return populated product data
    const populatedOrder =
      await Order.findById(order._id)
        .populate("items.product")
        .populate("user", "name email");

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Cancel order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};