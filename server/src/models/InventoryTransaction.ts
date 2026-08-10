import mongoose, { Schema, type Document } from "mongoose";

export interface IInventoryTransaction extends Document {
  product: mongoose.Types.ObjectId;
  type: "add" | "remove";
  quantity: number;
  previousStock: number;
  newStock: number;
  performedBy: mongoose.Types.ObjectId;
}

const inventoryTransactionSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["add", "remove"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },

    newStock: {
      type: Number,
      required: true,
      min: 0,
    },

    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryTransaction = mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema
);

export default InventoryTransaction;