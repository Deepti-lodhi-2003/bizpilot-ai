import { type Response } from "express";
import { type AuthenticatedRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

export const getProfile = async ( req: AuthenticatedRequest,  res: Response ): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

import bcrypt from "bcrypt";

export const updateProfile = async ( req: AuthenticatedRequest, res: Response ): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { name, email, phone, address, avatar, password } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const updatedUser = await User.findById(req.user.userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};