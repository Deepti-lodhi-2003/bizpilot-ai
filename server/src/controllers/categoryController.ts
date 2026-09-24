import { type Request, type Response } from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

// GET ALL CATEGORIES
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    // Count products per category
    const productCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    productCounts.forEach((item) => {
      if (item._id) {
        countMap.set(String(item._id), item.count);
      }
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      productCount: countMap.get(String(cat._id)) || 0,
    }));

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error: any) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error?.message || String(error),
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
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "Category with this name already exists",
      });

      return;
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
      image: image ? String(image).trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: {
        ...category.toObject(),
        productCount: 0,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    if (!name || !description) {
      res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
      return;
    }

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    if (name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        _id: { $ne: id },
      } as any);
      if (existing) {
        res.status(409).json({
          success: false,
          message: "A category with this name already exists",
        });
        return;
      }
    }

    category.name = name.trim();
    category.description = description.trim();
    if (image !== undefined) {
      category.image = String(image).trim();
    }

    await category.save();

    const productCount = await Product.countDocuments({ category: id } as any);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error: any) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error?.message || String(error),
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