import { type Request, type Response } from "express";
import Product from "../models/Product.js";

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

    if (!name || !description || !price || !category) {
      res.status(400).json({
        success: false,
        message:
          "Name, description, price and category are required",
      });
      return;
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      category,
      image,
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
  } catch (error) {
    console.error("Create Product:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
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

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

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
    catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
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