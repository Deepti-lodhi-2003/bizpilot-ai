import mongoose from "mongoose";
import { type Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { type UserRequest } from "../middleware/userRequest.js";
import Order from "../models/Order.js";
import Payment from "../models/paymentModel.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createPaymentOrder = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await Order.findOne({
            _id: new mongoose.Types.ObjectId(orderId),
            user: req.user!.userId,
        });

        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }

        const options = {
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${order._id}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        await Payment.create({
            user: req.user!.userId,
            order: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: order.totalAmount,
            status: "created",
        });

        res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            order: razorpayOrder,
        });
    }
    catch (error) {
        console.error("Create payment order error:", error);

        res.status(500).json({
            success: false,
            message: "Payment order creation failed",
        });
    }
};



export const verifyPayment = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
      return;
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
      return;
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user!.userId,
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
      return;
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";

    await payment.save();

    await Order.findByIdAndUpdate(
      payment.order,
      {
        status: "confirmed",
      }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: payment.order,
    });
  }
   catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};