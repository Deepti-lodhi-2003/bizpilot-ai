import mongoose, { Schema } from "mongoose";

interface IUser {
    name: string;
    email: string;
    password: string;
    role: "admin" | "customer";
    phone?: string;
    address?: string;
    avatar?: string;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;