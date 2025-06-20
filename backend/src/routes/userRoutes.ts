import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/user", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "User routes are working!" });
});

export default router;
