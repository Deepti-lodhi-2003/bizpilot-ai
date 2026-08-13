import mongoose, { Schema, type Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  image: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>( "Category", categorySchema );

export default Category;