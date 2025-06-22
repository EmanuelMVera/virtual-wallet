import { Request, Response, Router } from "express";

const router = Router();

router.get("/account", (req: Request, res: Response) => {
  res.status(200).json({ message: "Account routes are working!" });
});

export default router;
