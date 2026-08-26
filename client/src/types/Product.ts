export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category:
    | string
    | {
        _id: string;
        name: string;
        image?: string;
      };
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getCategoryName = (category: Product["category"]): string => {
  if (typeof category === "string") {
    return category;
  }
  if (category && typeof category === "object" && "name" in category) {
    return category.name;
  }
  return "";
};