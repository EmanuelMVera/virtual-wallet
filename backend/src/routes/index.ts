import { Router } from "express";
import userRoutes from "./userRoutes.js";
import walletRoutes from "./walletRoutes.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/wallet", protect, walletRoutes);

export default router;
