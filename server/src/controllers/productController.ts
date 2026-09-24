import mongoose from "mongoose";
import { type Request, type Response } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Helper to resolve category ID whether given an ObjectId string or a Category Name string
const resolveCategoryId = async (
  categoryInput: string
): Promise<mongoose.Types.ObjectId> => {
  const trimmed = String(categoryInput).trim();

  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    const existingById = await Category.findById(trimmed);
    if (existingById) {
      return existingById._id as mongoose.Types.ObjectId;
    }
  }

  // Find category by name (case-insensitive)
  let cat = await Category.findOne({
    name: { $regex: new RegExp(`^${trimmed}$`, "i") },
  });

  // If category doesn't exist, create it automatically
  if (!cat) {
    cat = await Category.create({
      name: trimmed,
      description: `${trimmed} category`,
      image: "",
    });
  }

  return cat._id as mongoose.Types.ObjectId;
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      image,
    } = req.body;

    if (!name || !description || price === undefined || price === null || !category) {
      res.status(400).json({
        success: false,
        message:
          "Name, description, price and category are required",
      });
      return;
    }

    const categoryId = await resolveCategoryId(category);

    const product = await Product.create({
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      category: categoryId,
      image: image || "",
    });

    const populated = await Product.findById(product._id).populate(
      "category",
      "name image"
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populated,
    });
  } catch (error: any) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};


export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find()
      .populate("category", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name image"
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.category) {
            updateData.category = await resolveCategoryId(updateData.category);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate("category", "name image");

        if (!updatedProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    }
    catch (error: any) {
        console.error("Update product error:", error);

        res.status(500).json({
            success: false,
            message: error?.message || "Server error",
        });
    }
};


export const deleteProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};