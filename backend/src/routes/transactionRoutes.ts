import { Request, Response, Router } from "express";

const router = Router();

// Rutas para opteraciones de transacciones
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Transaction routes are working!" });
});

// Ruta para crear una nueva transacción
router.post("/transfer", (req: Request, res: Response) => {
  res.status(200).json({ message: "Transfer routes are working!" });
});

export default router;
