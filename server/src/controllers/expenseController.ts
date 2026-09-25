import { type Response } from "express";
import mongoose from "mongoose";

import Expense from "../models/Expense.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

// ======================================
// CREATE EXPENSE
// ======================================

export const createExpense = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      category,
      amount,
      date,
      paymentMethod,
      status,
      description,
    } = req.body;

    // AUTH CHECK
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // VALIDATION
    if (
      !title ||
      !category ||
      amount === undefined ||
      !date ||
      !paymentMethod
    ) {
      res.status(400).json({
        success: false,
        message:
          "Title, category, amount, date and payment method are required",
      });

      return;
    }

    if (Number(amount) < 0) {
      res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });

      return;
    }

    // CREATE
    const expense = await Expense.create({
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      paymentMethod,
      status: status || "Pending",
      description: description?.trim() || "",
      createdBy: new mongoose.Types.ObjectId(
        req.user.userId
      ),
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET ALL EXPENSES
// ======================================

export const getExpenses = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const userId = new mongoose.Types.ObjectId(
      req.user.userId
    );

    const expenses = await Expense.find({
      createdBy: userId,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET SINGLE EXPENSE
// ======================================

export const getExpenseById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    // AUTH CHECK
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ID CHECK
    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });

      return;
    }

    const userId = new mongoose.Types.ObjectId(
      req.user.userId
    );

    const expense = await Expense.findOne({
      _id: new mongoose.Types.ObjectId(id),
      createdBy: userId,
    });

    if (!expense) {
      res.status(404).json({
        success: false,
        message: "Expense not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get expense error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// UPDATE EXPENSE
// ======================================

export const updateExpense = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    // AUTH CHECK
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ID CHECK
    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });

      return;
    }

    const userId = new mongoose.Types.ObjectId(
      req.user.userId
    );

    const updatedExpense =
      await Expense.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
          createdBy: userId,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedExpense) {
      res.status(404).json({
        success: false,
        message: "Expense not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// DELETE EXPENSE
// ======================================

export const deleteExpense = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    // AUTH CHECK
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ID CHECK
    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });

      return;
    }

    const userId = new mongoose.Types.ObjectId(
      req.user.userId
    );

    const deletedExpense =
      await Expense.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        createdBy: userId,
      });

    if (!deletedExpense) {
      res.status(404).json({
        success: false,
        message: "Expense not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};