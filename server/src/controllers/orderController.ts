import mongoose from "mongoose";
import { type Request, type Response } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { type OrderRequest } from "../types/orderTypes.js";
import { type UserRequest } from "../middleware/userRequest.js";


export const createOrder = async (
    req: OrderRequest,
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

        const existingProduct = await Product.findById(product);

        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });

            return;
        }

        const totalAmount = existingProduct.price * quantity;

        const order = await Order.create({
            user: new mongoose.Types.ObjectId(req.user!.userId),
            product,
            quantity,
            totalAmount,
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



export const getMyOrders = async (
    req: UserRequest,
    res: Response
): Promise<void> => {
    try {
        const orders = await Order.find({
            user: req.user!.userId,
        }).populate("product");

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



export const getOrderById = async (
    req: UserRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await Order.findOne({
            _id: new mongoose.Types.ObjectId(id as string),
            user: req.user!.userId,
        }).populate("product");

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
        console.error("Get order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



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

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



export const getAllOrders = async (
    req: UserRequest,
    res: Response
): Promise<void> => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("product");

        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.error("Get all orders error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



export const cancelOrder = async (
    req: UserRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await Order.findOne({
            _id: new mongoose.Types.ObjectId(id as string),
            user: req.user!.userId,
        });

        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }

        if (order.status !== "pending" && order.status !== "confirmed") {
            res.status(400).json({
                success: false,
                message: "Order cannot be cancelled now",
            });
            return;
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });
    }
    catch (error) {
        console.error("Cancel order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};