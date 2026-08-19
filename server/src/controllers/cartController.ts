import { type Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cartModel.js";
import Product from "../models/Product.js";
import { type UserRequest } from "../middleware/userRequest.js";

// ===============================
// ADD TO CART
// ===============================
export const addToCart = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity) {
      res.status(400).json({
        success: false,
        message: "Product and quantity are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const productExists = await Product.findById(product);

    if (!productExists) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if (quantity > productExists.stock) {
      res.status(400).json({
        success: false,
        message: `Only ${productExists.stock} items available`,
      });
      return;
    }

    const existingCart = await Cart.findOne({
      user: req.user!.userId,
      product,
    });

    if (existingCart) {
      const newQuantity = existingCart.quantity + quantity;

      if (newQuantity > productExists.stock) {
        res.status(400).json({
          success: false,
          message: `Only ${productExists.stock} items available`,
        });
        return;
      }

      existingCart.quantity = newQuantity;

      await existingCart.save();

      res.status(200).json({
        success: true,
        message: "Cart quantity updated",
        cart: existingCart,
      });

      return;
    }

    const cart = await Cart.create({
      user: req.user!.userId,
      product,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// GET CART
// ===============================
export const getCart = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const cart = await Cart.find({
      user: req.user!.userId,
    }).populate("product");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// UPDATE CART QUANTITY
// ===============================
export const updateCartQuantity = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
      return;
    }

    const cart = await Cart.findOne({
      _id: new mongoose.Types.ObjectId(id as string),
      user: req.user!.userId,
    }).populate("product");

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
      return;
    }

    const product = cart.product as any;

    if (quantity > product.stock) {
      res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
      return;
    }

    cart.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("product");

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// REMOVE FROM CART
// ===============================
export const removeFromCart = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
      return;
    }

    const cart = await Cart.findOne({
      _id: new mongoose.Types.ObjectId(id as string),
      user: req.user!.userId,
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
      return;
    }

    await cart.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// CLEAR CART
// ===============================
export const clearCart = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    await Cart.deleteMany({
      user: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};