import { Router } from "express";
import userRoutes from "./userRoutes.js";
import walletRoutes from "./walletRoutes.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

router.use("/users", userRoutes);
router.use("/wallet", protect, walletRoutes);

export default router;
