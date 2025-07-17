const { Order, OrderItem } = require("../models");
const { publishEvent } = require("../rabbitmq");
const { getProductDetails, updateProductStock, publishToQueue } = require("../utils/api");
const client = require('prom-client');

const businessEventCounter = new client.Counter({
  name: 'business_events_total',
  help: 'Nombre total d\'événements métier publiés',
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
    // Récupérer les prix des produits depuis le service produit
    const itemsWithPrices = [];
    let totalOrder = 0;

    for (const item of items) {
      // Récupérer les détails du produit
      const product = await getProductDetails(item.productId);
      if (!product) {
        return res.status(400).json({
          error: `Produit ${item.productId} introuvable`,
        });
      }

      // Vérifier le stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour le produit ${item.productId}. Stock disponible: ${product.quantity}, demandé: ${item.quantity}`,
        });
      }

      // Calculer le prix total pour cet item
      const itemTotal = product.price * item.quantity;
      totalOrder += itemTotal;

      itemsWithPrices.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        newStock: product.quantity - item.quantity,
      });
    }

    // Création de la commande
    const order = await Order.create({
      userId,
      total: totalOrder,
      status: "pending",
    });

    // Créer les items de la commande avec les prix corrects
    const orderItems = itemsWithPrices.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    await OrderItem.bulkCreate(orderItems);

    // Mettre à jour le stock des produits
    for (const item of itemsWithPrices) {
      // Mettre à jour le stock directement
      const stockUpdated = await updateProductStock(
        item.productId,
        item.newStock
      );

      if (!stockUpdated) {
        console.warn(
          `⚠️ Échec mise à jour stock pour produit ${item.productId}`
        );
      }

      // Envoyer message à RabbitMQ pour notification
      await publishToQueue("product-queue", {
        type: "STOCK_UPDATED",
        data: {
          productId: item.productId,
          oldQuantity: item.newStock + item.quantity,
          newQuantity: item.newStock,
          orderId: order.id,
        },
      });
    }

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
