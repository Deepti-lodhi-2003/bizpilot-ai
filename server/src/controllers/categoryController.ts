import { type Request, type Response } from "express";
import Category from "../models/Category.js";

// GET ALL CATEGORIES
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// CREATE CATEGORY
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, image } = req.body;

    if (!name || !description) {
      res.status(400).json({
        success: false,
        message: "Name and description are required",
      });

      return;
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "Category already exists",
      });

      return;
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
      image: image || "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};