import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

export default router;
