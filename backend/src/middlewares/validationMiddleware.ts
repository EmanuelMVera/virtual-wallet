import { body, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
  body("name")
    .isString()
    .isLength({ min: 2 })
    .withMessage("El nombre es requerido y debe tener al menos 2 caracteres."),
  body("email").isEmail().withMessage("Se requiere un email válido."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Se requiere un email válido."),
  body("password").notEmpty().withMessage("La contraseña es requerida."),
];

export const transactionValidation = [
  body("senderAccountId")
    .isInt()
    .withMessage("Se requiere el ID de la cuenta de origen."),
  body("amount").isFloat({ gt: 0 }).withMessage("El monto debe ser positivo."),
  body().custom((value, { req }) => {
    if (
      !req.body.receiverAccountId &&
      !req.body.receiverAlias &&
      !req.body.receiverCbu
    ) {
      throw new Error(
        "Se requiere el ID, alias o CBU de la cuenta de destino."
      );
    }
    return true;
  }),
];

export const bankAccountValidation = [
  body("bankName")
    .isString()
    .notEmpty()
    .withMessage("El nombre del banco es requerido."),
  body("accountNumber")
    .isString()
    .notEmpty()
    .withMessage("El número de cuenta es requerido."),
];

export const depositValidation = [
  body("bankAccountId")
    .isInt()
    .withMessage("Se requiere el ID de la cuenta bancaria."),
  body("walletAccountId")
    .isInt()
    .withMessage("Se requiere el ID de la cuenta virtual."),
  body("amount").isFloat({ gt: 0 }).withMessage("El monto debe ser positivo."),
];
