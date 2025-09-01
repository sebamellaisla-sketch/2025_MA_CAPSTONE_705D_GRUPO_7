import { getAllProducts } from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const { category_id } = req.query;
    const products = await getAllProducts(category_id);
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};