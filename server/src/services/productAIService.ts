import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getRequestedProduct = async (
    message: string
) => {
    const text = message
        .toLowerCase()
        .trim()
        .replace(/[?!.]/g, "");

    const productText = text
        .replace(
            /^(how many|how much|what is|what's|whats|is|tell me|show me|give me)/i,
            ""
        )
        .replace(
            /\b(stock|price|quantity|details|information|info|available|in stock|low stock|sold|sales|revenue|generated)\b/gi,
            ""
        )
        .replace(
            /\b(of|for|about|have|has|been)\b/gi,
            ""
        )
        .trim();

    if (!productText) {
        return null;
    }

    const product = await Product.findOne({
        name: {
            $regex: productText,
            $options: "i",
        },
    }).select("name stock price");

    return product;
};

// =====================================
// GET PRODUCT SALES
// =====================================

export const getProductSales = async (
    productId: string
) => {
    const salesData = await Order.aggregate([
        {
            $match: {
                status: {
                    $ne: "cancelled",
                },
            },
        },

        {
            $unwind: "$items",
        },

        {
            $match: {
                "items.product":
                    new mongoose.Types.ObjectId(productId),
            },
        },

        {
            $group: {
                _id: null,

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
    ]);

    return {
        totalQuantity:
            salesData[0]?.totalQuantity ?? 0,

        totalRevenue:
            salesData[0]?.totalRevenue ?? 0,
    };
};