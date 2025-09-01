import { Router } from "express";
import { register, login, getMe } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

export default router;
