import { Router } from "express";
import { register, login, getMe } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

// /api/auth/register
router.post("/register", register);

// /api/auth/login
router.post("/login", login);

// /api/auth/me  (requiere token Bearer)
router.get("/me", verifyJWT, getMe);

// (opcional) /api/auth/logout — útil si algún día usas cookie httpOnly
router.post("/logout", (req, res) => {
  // Si usas cookies: res.clearCookie("token", { httpOnly:true, sameSite:"lax", secure:false, path:"/" });
  return res.status(200).json({ ok: true });
});

export default router;
