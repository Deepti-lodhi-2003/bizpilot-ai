import { Router } from "express";

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { getProfile } from "../controllers/profileController.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/orderController.js";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import {
  getInventory,
  addStock,
  removeStock,
  getInventoryHistory,
} from "../controllers/inventoryController.js";

import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  getAllCustomers,
  getCustomerStats,
  getCustomerById,
} from "../controllers/customerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

// ===============================
// AUTH
// ===============================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
  "/profile",
  protect,
  authorize("owner", "admin"),
  getProfile
);

// ===============================
// PRODUCT
// ===============================

router.post(
  "/products",
  protect,
  authorize("owner", "admin"),
  createProduct
);

router.get(
  "/products",
  getProducts
);

router.get(
  "/products/:id",
  getProductById
);

router.put(
  "/products/:id",
  protect,
  authorize("owner", "admin"),
  updateProduct
);

router.delete(
  "/products/:id",
  protect,
  authorize("owner", "admin"),
  deleteProduct
);

// ===============================
// ORDER
// ===============================
router.post(
  "/orders",
  protect,
  createOrder
);

router.get(
  "/orders",
  protect,
  getMyOrders
);

router.get(
  "/orders/:id",
  protect,
  getOrderById
);

router.put(
  "/orders/:id/cancel",
  protect,
  cancelOrder
);
// ======================================
// ADMIN ORDERS
// ======================================

router.get(
  "/admin/orders",
  protect,
  authorize("owner", "admin"),
  getAllOrders
);

router.put(
  "/orders/:id/status",
  protect,
  authorize("owner", "admin"),
  updateOrderStatus
);

// ===============================
// CART
// ===============================

router.post(
  "/cart",
  protect,
  addToCart
);

router.get(
  "/cart",
  protect,
  getCart
);

router.put(
  "/cart/:id",
  protect,
  updateCartQuantity
);

router.delete(
  "/cart/:id",
  protect,
  removeFromCart
);

// ⭐ NEW
router.delete(
  "/cart",
  protect,
  clearCart
);

// ===============================
// PAYMENT
// ===============================

router.post(
  "/payment/create-order",
  protect,
  createPaymentOrder
);

router.post(
  "/payment/verify",
  protect,
  verifyPayment
);

// ===============================
// INVENTORY
// ===============================

router.get(
  "/inventory",
  protect,
  authorize("owner", "admin"),
  getInventory
);

router.put(
  "/inventory/:productId/add",
  protect,
  authorize("owner", "admin"),
  addStock
);

router.put(
  "/inventory/:productId/remove",
  protect,
  authorize("owner", "admin"),
  removeStock
);

router.get(
  "/inventory/:productId/history",
  protect,
  authorize("owner", "admin"),
  getInventoryHistory
);

// ===============================
// CATEGORIES
// ===============================

router.get(
  "/categories",
  getCategories
);

router.post(
  "/categories",
  protect,
  authorize("owner", "admin"),
  createCategory
);

router.put(
  "/categories/:id",
  protect,
  authorize("owner", "admin"),
  updateCategory
);

router.delete(
  "/categories/:id",
  protect,
  authorize("owner", "admin"),
  deleteCategory
);

// ===============================
// ADDRESS
// ===============================

router.get(
  "/addresses",
  protect,
  getMyAddresses
);

router.post(
  "/addresses",
  protect,
  addAddress
);

router.put(
  "/addresses/:id",
  protect,
  updateAddress
);

router.delete(
  "/addresses/:id",
  protect,
  deleteAddress
);

router.put(
  "/addresses/:id/default",
  protect,
  setDefaultAddress
);

// ===============================
// CUSTOMERS (ADMIN)
// ===============================

router.get(
  "/admin/customers/stats",
  protect,
  authorize("owner", "admin"),
  getCustomerStats
);

router.get(
  "/admin/customers",
  protect,
  authorize("owner", "admin"),
  getAllCustomers
);

router.get(
  "/admin/customers/:id",
  protect,
  authorize("owner", "admin"),
  getCustomerById
);

export default router;