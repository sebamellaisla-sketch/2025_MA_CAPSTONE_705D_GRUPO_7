// backend/src/middlewares/auth.js
import jwt from "jsonwebtoken";

// Extrae token desde Authorization: Bearer xxx o cookie "token"
function extractToken(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  if (req.cookies?.token) return req.cookies.token; // por si usas cookie httpOnly
  return null;
}

export const verifyToken = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: "Falta token" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "JWT_SECRET no configurado" });

    const payload = jwt.verify(token, secret); // { id, role, iat, exp }
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Alias para compatibilidad con código que use verifyJWT
export const verifyJWT = verifyToken;

// Restringe a rol admin
export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });
  const role = String(req.user.role || "").toLowerCase();
  if (role !== "admin") return res.status(403).json({ error: "Requiere rol admin" });
  return next();
};

// (Opcional) permitir varios roles: allowRoles("admin","editor")
export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });
  const role = String(req.user.role || "").toLowerCase();
  const ok = roles.map(r => String(r).toLowerCase()).includes(role);
  if (!ok) return res.status(403).json({ error: "Permisos insuficientes" });
  return next();
};
