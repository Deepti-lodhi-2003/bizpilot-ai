import { Router } from "express";

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { getProfile } from "../controllers/profileController.js";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct,} from "../controllers/productController.js";
import {  createOrder,  getMyOrders,  getOrderById, updateOrderStatus, cancelOrder, getAllOrders,} from "../controllers/orderController.js";
import { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart,} from "../controllers/cartController.js";
import { createPaymentOrder, verifyPayment,} from "../controllers/paymentController.js";
import { getInventory, addStock, removeStock, getInventoryHistory,} from "../controllers/inventoryController.js";
import { getMyAddresses, addAddress, updateAddress,deleteAddress, setDefaultAddress,} from "../controllers/addressController.js";
import { getCategories, createCategory, updateCategory, deleteCategory,} from "../controllers/categoryController.js";
import { getAllCustomers, getCustomerStats,getCustomerById,} from "../controllers/customerController.js";
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getExpenseCategories } from "../controllers/expenseController.js";
import { getAnalytics } from "../controllers/analyticsController.js";
import { chatWithAI } from "../controllers/aiController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();


// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);


// PRODUCT
router.post( "/products", protect, authorize("admin"), createProduct);
router.get("/products", getProducts);
router.get("/products/:id",getProductById);
router.put("/products/:id",protect, authorize("admin"), updateProduct);
router.delete( "/products/:id", protect, authorize("admin"), deleteProduct);


// ORDER
router.post("/orders",protect,createOrder);
router.get( "/orders", protect, getMyOrders);
router.get("/orders/:id",protect,getOrderById);
router.put( "/orders/:id/cancel", protect, cancelOrder);


// ADMIN ORDERS
router.get( "/admin/orders", protect, authorize("admin"), getAllOrders);
router.put( "/orders/:id/status", protect, authorize("admin"), updateOrderStatus);


// CART
router.post( "/cart", protect, addToCart);
router.get( "/cart", protect, getCart);
router.put( "/cart/:id",protect, updateCartQuantity);
router.delete( "/cart/:id", protect, removeFromCart);

// NEW
router.delete("/cart", protect,  clearCart);


// PAYMENT
router.post( "/payment/create-order", protect, createPaymentOrder);
router.post( "/payment/verify", protect,verifyPayment);


// INVENTORY
router.get( "/inventory", protect, authorize("admin"),getInventory);
router.put( "/inventory/:productId/add", protect, authorize("admin"), addStock);
router.put( "/inventory/:productId/remove", protect, authorize("admin"), removeStock);
router.get( "/inventory/:productId/history", protect, authorize("admin"), getInventoryHistory);


// CATEGORIES
router.get( "/categories", getCategories);
router.post( "/categories", protect, authorize("admin"),createCategory);
router.put( "/categories/:id", protect, authorize("admin"),updateCategory);
router.delete( "/categories/:id", protect, authorize("admin"), deleteCategory);


// ADDRESS
router.get( "/addresses", protect, getMyAddresses);
router.post( "/addresses", protect, addAddress);
router.put( "/addresses/:id", protect, updateAddress);
router.delete( "/addresses/:id", protect, deleteAddress);
router.put( "/addresses/:id/default", protect, setDefaultAddress);


// CUSTOMERS (ADMIN)
router.get( "/admin/customers/stats", protect, authorize("admin"), getCustomerStats);
router.get( "/admin/customers", protect, authorize("admin"), getAllCustomers);
router.get( "/admin/customers/:id", protect, authorize("admin"),getCustomerById);


// Expenses 
router.post("/expenses", protect, authorize("admin"), createExpense);
router.get( "/expenses", protect, authorize("admin"), getExpenses);
router.get( "/expenses/categories", protect, authorize("admin"), getExpenseCategories);
router.get( "/expenses/:id", protect, authorize("admin"), getExpenseById);
router.put( "/expenses/:id", protect, authorize("admin"), updateExpense);
router.delete( "/expenses/:id", protect, authorize("admin"), deleteExpense);


// ANALYTICS
router.get("/analytics", protect, authorize("admin"), getAnalytics);

// AI Assistance
router.post( "/ai/chat", protect, authorize("admin"), chatWithAI );


export default router;