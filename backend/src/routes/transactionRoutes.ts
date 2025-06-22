import { Request, Response, Router } from "express";

const router = Router();

router.get("/transaction", (req: Request, res: Response) => {
  res.status(200).json({ message: "Transaction routes are working!" });
});

export default router;
