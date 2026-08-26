        import mongoose, { Schema, type Document } from "mongoose";

        export interface IOrderItem {
        product: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
        }

        export interface IOrder extends Document {
        user: mongoose.Types.ObjectId;

        items: IOrderItem[];

        totalAmount: number;

        shippingAddress: {
            fullName: string;
            phone: string;
            addressLine: string;
            city: string;
            state: string;
            pincode: string;
        };

        status:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";

        createdAt: Date;
        updatedAt: Date;
        }

        const orderItemSchema = new Schema<IOrderItem>(
        {
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

            price: {
            type: Number,
            required: true,
            min: 0,
            },
        },
        { _id: false }
        );

        const orderSchema = new Schema<IOrder>(
        {
            user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            },

            items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) =>
                items.length > 0,
                message: "Order must contain at least one item",
            },
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
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
            },
        },
        {
            timestamps: true,
        }
        );

        const Order = mongoose.model<IOrder>(
        "Order",
        orderSchema
        );

        export default Order;