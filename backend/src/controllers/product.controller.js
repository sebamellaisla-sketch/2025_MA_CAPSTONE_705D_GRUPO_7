// backend/src/controllers/product.controller.js
import { getAllProducts, createProductDB, updateProductDB, deleteProductDB, getProductById } from "../models/product.model.js";

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

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nombre y precio son obligatorios" });
    }

    const product = await createProductDB({
      name,
      description,
      price: parseFloat(price),
      image_url,
      category_id: category_id ? parseInt(category_id) : null
    });

    res.status(201).json({ message: "Producto creado exitosamente", product });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nombre y precio son obligatorios" });
    }

    const product = await updateProductDB(id, {
      name,
      description,
      price: parseFloat(price),
      image_url,
      category_id: category_id ? parseInt(category_id) : null
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado exitosamente", product });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProductDB(id);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};