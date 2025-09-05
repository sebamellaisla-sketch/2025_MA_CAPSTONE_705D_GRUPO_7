// backend/src/controllers/category.controller.js
import { getAllCategories, createCategoryDB, updateCategoryDB, deleteCategoryDB, getCategoryById } from "../models/category.model.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    res.json(category);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const category = await createCategoryDB({ name, image_url });
    res.status(201).json({ message: "Categoría creada exitosamente", category });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const category = await updateCategoryDB(id, { name, image_url });

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría actualizada exitosamente", category });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCategoryDB(id);

    if (!deleted) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};