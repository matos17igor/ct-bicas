import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { AuhtController } from "./controllers/AuthController.js";

const router = Router();
const userController = new UserController();
const auhtController = new AuhtController();

router.post("/users", userController.create);
router.post("/login", auhtController.login);

export { router };
