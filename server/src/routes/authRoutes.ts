import { Router } from "express";

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { getProfile } from "../controllers/profileController.js";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import { createOrder, getMyOrders, updateOrderStatus, getAllOrders, cancelOrder } from "../controllers/orderController.js";
import { addToCart, getCart, updateCartQuantity, removeFromCart } from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";


const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, authorize("owner", "admin"), getProfile);

// product route
router.post("/product", protect, authorize("owner", "admin"), createProduct);

router.get("/products", protect, authorize("owner", "admin"), getProducts);

router.get("/products/:id", protect, authorize("owner", "admin"), getProductById);

router.put("/products/:id", protect, authorize("owner", "admin"), updateProduct);

router.delete("/products/:id", protect, authorize("owner", "admin"), deleteProduct);

// order route
router.post("/order", protect, createOrder);

router.get("/orders", protect, getMyOrders);

router.put("/orders/:id/status", protect, authorize("owner", "admin"), updateOrderStatus);

router.get("/admin/orders", protect, authorize("owner", "admin"), getAllOrders);

router.put("/orders/:id/cancel", protect, cancelOrder);

// cart route
router.post("/cart", protect, addToCart);

router.get("/cart", protect, getCart);

router.put("/cart/:id", protect, updateCartQuantity);

router.delete("/cart/:id", protect, removeFromCart);

export default router;