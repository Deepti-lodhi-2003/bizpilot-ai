import { Router } from "express";

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { getProfile } from "../controllers/profileController.js";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, authorize("owner", "admin"), getProfile);

router.post("/product", protect, authorize("owner", "admin"), createProduct);

router.get("/products", protect, authorize("owner", "admin"), getProducts);

router.get("/products/:id", protect, authorize("owner", "admin"), getProductById);

router.put("/products/:id", protect, authorize("owner", "admin"), updateProduct);

router.delete("/products/:id", protect, authorize("owner", "admin"), deleteProduct);


export default router;