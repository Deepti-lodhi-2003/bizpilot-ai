import mongoose from "mongoose";
import { type Response } from "express";
import Address from "../models/Address.js";
import { type UserRequest } from "../middleware/userRequest.js";

// ===============================
// GET MY ADDRESSES
// ===============================
export const getMyAddresses = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const addresses = await Address.find({
      user: req.user!.userId,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

// ===============================
// ADD ADDRESS
// ===============================
export const addAddress = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine ||
      !city ||
      !state ||
      !pincode
    ) {
      res.status(400).json({
        success: false,
        message: "All address fields are required",
      });

      return;
    }

    // If this is the first address, make it default
    const existingAddressCount = await Address.countDocuments({
      user: req.user!.userId,
    });

    const shouldBeDefault =
      existingAddressCount === 0 || isDefault === true;

    if (shouldBeDefault) {
      await Address.updateMany(
        { user: req.user!.userId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user!.userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault: shouldBeDefault,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error("Add address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

// ===============================
// UPDATE ADDRESS
// ===============================
export const updateAddress = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
      return;
    }

    const address = await Address.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user!.userId,
    });

    if (!address) {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
      return;
    }

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine ||
      !city ||
      !state ||
      !pincode
    ) {
      res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
      return;
    }

    if (isDefault === true) {
      await Address.updateMany(
        {
          user: req.user!.userId,
        },
        {
          isDefault: false,
        }
      );
    }

    address.fullName = fullName;
    address.phone = phone;
    address.addressLine = addressLine;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.isDefault = isDefault === true;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Update address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

// ===============================
// DELETE ADDRESS
// ===============================
export const deleteAddress = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
      return;
    }

    const address = await Address.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user!.userId,
    });

    if (!address) {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
      return;
    }

    const wasDefault = address.isDefault;

    await address.deleteOne();

    // Deleted address was default
    if (wasDefault) {
      const nextAddress = await Address.findOne({
        user: req.user!.userId,
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

// ===============================
// SET DEFAULT ADDRESS
// ===============================
export const setDefaultAddress = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
      return;
    }

    const address = await Address.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user!.userId,
    });

    if (!address) {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
      return;
    }

    await Address.updateMany(
      {
        user: req.user!.userId,
      },
      {
        isDefault: false,
      }
    );

    address.isDefault = true;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Set default address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};