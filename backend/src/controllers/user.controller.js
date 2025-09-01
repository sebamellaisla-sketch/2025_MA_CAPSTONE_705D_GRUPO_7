import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { findUserByEmail, createUser } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword, role });
    const token = generateToken({ id: newUser.id, role: newUser.role });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }
    const token = generateToken({ id: user.id, role: user.role });
    res.json({ user, token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};