import { Router } from "express";
import authController from "../../controllers/auth-controller/userController";
import {
  validateLogin,
  validateUser,
  validate,
} from "../../middlewares/validator";

const router: Router = Router();

// USER
router.post("/register", validateUser, validate, authController.createUser);
router.post("/login", validateLogin, validate, authController.loginUser);

export default router;
