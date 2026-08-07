import mongoose, { type Document } from "mongoose";

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
}

const cartSchema = new mongoose.Schema<ICart>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;