import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

export const validateLogin = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 to 20 characters long!"),
];

export const validateUser = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 to 15 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 to 20 characters long!"),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).array();
  if (!errors.length) return next();

  res.status(400).json({ success: false, error: errors[0].msg });
};
