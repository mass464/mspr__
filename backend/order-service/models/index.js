const { sequelize } = require("../config/db");
const { Order } = require("./order.model");
const { OrderItem } = require("./orderItem.model");

// Associations
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

const initializeModels = async () => {
  try {
    console.log("🔄 Synchronisation des modèles...");

    // Sync dans l'ordre : d'abord Order, puis OrderItem
    await Order.sync({ alter: true });
    await OrderItem.sync({ alter: true });

    console.log("✅ Tables synchronisées avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
    throw error;
  }
};

module.exports = {
  Order,
  OrderItem,
  initializeModels,
};
