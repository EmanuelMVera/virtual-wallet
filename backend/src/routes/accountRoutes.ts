import { Request, Response, Router } from "express";

const router = Router();

// Ruta para obtener el balance de la cuenta
router.get("/balance", (req: Request, res: Response) => {
  res.status(200).json({ message: "Balance routes are working!" });
});

export default router;
