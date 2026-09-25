import mongoose, {
  Schema,
  type Document,
} from "mongoose";

// ======================================
// EXPENSE INTERFACE
// ======================================

export interface IExpense extends Document {
  title: string;

  category:
    | "Rent"
    | "Salary"
    | "Utilities"
    | "Marketing"
    | "Travel"
    | "Office Supplies"
    | "Software"
    | "Other";

  amount: number;

  date: Date;

  paymentMethod:
    | "Cash"
    | "Card"
    | "Bank Transfer"
    | "UPI";

  status: "Paid" | "Pending";

  description?: string;

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

// ======================================
// EXPENSE SCHEMA
// ======================================

const expenseSchema = new Schema<IExpense>(
  {
    // Expense title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Expense category
    category: {
      type: String,
      enum: [
        "Rent",
        "Salary",
        "Utilities",
        "Marketing",
        "Travel",
        "Office Supplies",
        "Software",
        "Other",
      ],
      required: true,
    },

    // Expense amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Expense date
    date: {
      type: Date,
      required: true,
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "Card",
        "Bank Transfer",
        "UPI",
      ],
      required: true,
    },

    // Payment status
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },

    // Optional description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // User who created the expense
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// MODEL
// ======================================

const Expense = mongoose.model<IExpense>(
  "Expense",
  expenseSchema
);

export default Expense;