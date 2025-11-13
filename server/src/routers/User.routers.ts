import { Router } from "express";
import UserControllers from "../controllers/User.controllers";

const router = Router();

router.post("/signup", UserControllers.signup);
router.post("/login", UserControllers.login);

export default router;