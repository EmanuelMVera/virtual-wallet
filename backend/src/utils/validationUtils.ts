import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export function isPositiveNumber(value: string | number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  return !isNaN(num) && num > 0;
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
