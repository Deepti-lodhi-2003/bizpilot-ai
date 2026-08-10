import mongoose, { type Document } from "mongoose";

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    status: "created" | "paid" | "failed";
}

const paymentSchema = new mongoose.Schema<IPayment>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
        },

        razorpayPaymentId: {
            type: String,
        },

        razorpaySignature: {
            type: String,
        },

        amount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;