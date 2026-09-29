import { type Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import { askAI } from "../services/aiService.js";
import Order from "../models/Order.js";

// ======================================
// CHAT WITH AI
// ======================================

export const chatWithAI = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
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
        // GET MESSAGE
        // ==================================

        const { message } = req.body;

        // ==================================
        // VALIDATION
        // ==================================

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            res.status(400).json({
                success: false,
                message: "Message is required",
            });

            return;
        }

        // ==================================
        // GET LOW STOCK PRODUCTS
        // ==================================

        const lowStockProducts = await Product.find({
            stock: { $gt: 0, $lte: 5 },
        }).select("name stock price");


        const topSellingProducts = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" },
                },
            },

            {
                $unwind: "$items",
            },

            {
                $group: {
                    _id: "$items.product",
                    totalQuantity: {
                        $sum: "$items.quantity",
                    },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                "$items.price",
                            ],
                        },
                    },
                },
            },

            {
                $sort: {
                    totalQuantity: -1,
                },
            },

            {
                $limit: 5,
            },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },

            {
                $unwind: "$product",
            },

            {
                $project: {
                    _id: 0,
                    name: "$product.name",
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
        ]);


        const topCustomers = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" },
                },
            },

            {
                $group: {
                    _id: "$user",
                    totalOrders: {
                        $sum: 1,
                    },
                    totalSpent: {
                        $sum: "$totalAmount",
                    },
                },
            },

            {
                $sort: {
                    totalSpent: -1,
                },
            },

            {
                $limit: 5,
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customer",
                },
            },

            {
                $unwind: "$customer",
            },

            {
                $project: {
                    _id: 0,
                    name: "$customer.name",
                    email: "$customer.email",
                    totalOrders: 1,
                    totalSpent: 1,
                },
            },
        ]);

        // ==================================
        // ASK AI
        // ==================================

        const reply = await askAI(
    message.trim(),
    {
        lowStockProducts,
        topSellingProducts,
        topCustomers,
    }
);
        // ==================================
        // RESPONSE
        // ==================================

        res.status(200).json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error(
            "AI chat error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get AI response",
        });
    }
};