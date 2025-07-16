const { Order, OrderItem } = require("../models");
const { publishEvent } = require("../rabbitmq");
const client = require('prom-client');

const businessEventCounter = new client.Counter({
  name: 'business_events_total',
  help: 'Nombre total d’événements métier publiés',
  labelNames: ['event_type', 'service']
});

exports.createOrder = async (req, res) => {
  const { userId, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "La liste des produits est vide ou invalide" });
  }
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({ error: "Chaque produit doit avoir un productId et une quantity valide" });
    }
  }
  try {
    // SUPPRESSION : vérification utilisateur et stock via HTTP
    // La logique de vérification d'utilisateur et de stock est désormais déléguée aux consommateurs RabbitMQ
    // Création de la commande
    const order = await Order.create({
      userId,
      total: 0, // sera mis à jour après création des items
      status: "pending",
    });
    let totalOrder = 0;
    const orderItems = items.map((item) => {
      const itemTotal = item.unitPrice ? item.unitPrice * item.quantity : 0;
      totalOrder += itemTotal;
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice || 0,
        totalPrice: itemTotal,
      };
    });
    await OrderItem.bulkCreate(orderItems);
    await order.update({ total: totalOrder });
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "productId", "quantity", "unitPrice", "totalPrice"],
        },
      ],
    });
    // Publier l'événement order_created
    publishEvent('order_created', { orderId: order.id, userId, items, total: totalOrder, date: new Date() });
    businessEventCounter.inc({ event_type: 'order_created', service: 'order-service' });
    res.status(201).json({ message: "Commande créée avec succès", order: createdOrder });
  } catch (error) {
    console.error("❌ Erreur création commande:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  console.log("=== GET /api/orders appelé ===", new Date().toISOString());
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "productId", "quantity", "unitPrice", "totalPrice"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur récupération commandes:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "productId", "quantity", "unitPrice", "totalPrice"],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Erreur récupération commande:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    const { total, ...updateData } = req.body;
    await order.update(updateData);
    const updatedOrder = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "productId", "quantity", "unitPrice", "totalPrice"],
        },
      ],
    });
    // Publier l'événement order_updated
    publishEvent('order_updated', { orderId: order.id, ...updateData, date: new Date() });
    businessEventCounter.inc({ event_type: 'order_updated', service: 'order-service' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("❌ Erreur mise à jour commande:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: "items" }],
    });
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    const orderItems = order.items.map(item => ({ productId: item.productId, quantity: item.quantity }));
    await order.destroy();
    // Publier l'événement order_deleted
    publishEvent('order_deleted', { orderId: req.params.id, items: orderItems, date: new Date() });
    businessEventCounter.inc({ event_type: 'order_deleted', service: 'order-service' });
    res.status(204).send();
  } catch (error) {
    console.error("❌ Erreur suppression commande:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "productId", "quantity", "unitPrice", "totalPrice"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur récupération commandes utilisateur:", error);
    res.status(500).json({ error: error.message });
  }
};
