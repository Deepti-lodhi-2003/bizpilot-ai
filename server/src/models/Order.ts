import mongoose, { Schema, type Document } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    totalAmount: number;

    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
    };

    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            addressLine: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled",],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;