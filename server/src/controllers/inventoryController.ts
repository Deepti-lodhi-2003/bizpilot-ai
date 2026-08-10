import { type Response } from "express";
import mongoose from "mongoose";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

export const getInventory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const addStock = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });

      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });

      return;
    }

    const previousStock = product.stock;
    const newStock = previousStock + Number(quantity);

    product.stock = newStock;

    await product.save();

    await InventoryTransaction.create({
      product: product._id,
      type: "add",
      quantity: Number(quantity),
      previousStock,
      newStock,
      performedBy: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Stock added successfully",
      product,
    });
  } catch (error) {
    console.error("Add stock error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const removeStock = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });

      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });

      return;
    }

    const previousStock = product.stock;

    if (Number(quantity) > previousStock) {
      res.status(400).json({
        success: false,
        message: "Cannot remove more stock than available",
      });

      return;
    }

    const newStock = previousStock - Number(quantity);

    product.stock = newStock;

    await product.save();

    await InventoryTransaction.create({
      product: product._id,
      type: "remove",
      quantity: Number(quantity),
      previousStock,
      newStock,
      performedBy: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Stock removed successfully",
      product,
    });
  } catch (error) {
    console.error("Remove stock error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getInventoryHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!productId || Array.isArray(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });

      return;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });

      return;
    }

    const history = await InventoryTransaction.find({
      product: new mongoose.Types.ObjectId(productId),
    })
      .populate("product", "name category")
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get inventory history error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};