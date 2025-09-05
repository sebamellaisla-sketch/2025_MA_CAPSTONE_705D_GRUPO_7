import { createOrderDB, getOrdersByUser, getAllOrders, updateOrderStatus as updateOrderStatusDB } from "../models/order.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shipping_address, phone } = req.body;
    const user_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    if (!shipping_address) {
      return res.status(400).json({ error: "La dirección de envío es obligatoria" });
    }

    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);

    const formattedItems = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.price)
    }));

    const order = await createOrderDB({
      user_id,
      total,
      items: formattedItems,
      shipping_address,
      phone
    });

    const itemsList = items.map(item => 
      `- ${item.name} x${item.quantity} - $${parseFloat(item.price).toLocaleString("es-CL")}`
    ).join('\n');

    await sendEmail({
      subject: `Nuevo pedido #${order.id}`,
      html: `
        <h2>Nuevo pedido recibido</h2>
        <p><strong>Pedido #:</strong> ${order.id}</p>
        <p><strong>Total:</strong> $${total.toLocaleString("es-CL")}</p>
        <p><strong>Dirección:</strong> ${shipping_address}</p>
        <p><strong>Teléfono:</strong> ${phone || "No especificado"}</p>
        <h3>Productos:</h3>
        <pre>${itemsList}</pre>
        <hr/>
        <p>Pedido realizado desde la web de Testheb</p>
      `
    });

    res.status(201).json({ 
      message: "Pedido creado exitosamente", 
      order: {
        id: order.id,
        total: order.total,
        status: order.status
      }
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ error: "Error al procesar el pedido" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await getOrdersByUser(user_id);
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener todos los pedidos:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const order = await updateOrderStatusDB(id, status);
    
    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ message: "Estado actualizado exitosamente", order });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};