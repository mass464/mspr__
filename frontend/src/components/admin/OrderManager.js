import React, { useState, useEffect } from "react";
import { orderAPI } from "../../services/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Récupérer toutes les commandes
  const fetchOrders = async () => {
    try {
      const response = await orderAPI.get("/");
      setOrders(response.data);
    } catch (error) {
      console.error("Erreur récupération commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Modifier le statut d'une commande
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.put(`/${orderId}`, { status: newStatus });
      alert("Statut de la commande mis à jour");
      fetchOrders();
    } catch (error) {
      alert("Erreur lors de la mise à jour: " + error.response?.data?.error);
    }
  };

  // Supprimer une commande
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await orderAPI.delete(`/${orderId}`);
        alert("Commande supprimée avec succès");
        fetchOrders();
      } catch (error) {
        alert("Erreur lors de la suppression: " + error.response?.data?.error);
      }
    }
  };

  // Voir les détails d'une commande
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Filtrer les commandes par statut
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "paid":
        return "#28a745";
      case "shipped":
        return "#007bff";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="order-manager">
      <h2>🧾 Gestion des Commandes</h2>

      {/* Filtres */}
      <div className="filters">
        <label>
          Filtrer par statut:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="pending">En attente</option>
            <option value="paid">Payées</option>
            <option value="shipped">Expédiées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </label>
      </div>

      {/* Liste des commandes */}
      <div className="orders-list">
        <h3>Liste des commandes ({filteredOrders.length})</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>User ID: {order.userId}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.total}€</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => viewOrderDetails(order)}>
                    👁️ Voir
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">En attente</option>
                    <option value="paid">Payée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal des détails de commande */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la commande #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <p>
                  <strong>Utilisateur:</strong> {selectedOrder.userId}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                </p>
                <p>
                  <strong>Statut:</strong> {selectedOrder.status}
                </p>
                <p>
                  <strong>Total:</strong> {selectedOrder.total}€
                </p>
              </div>

              <h4>Articles commandés:</h4>
              <table className="order-items">
                <thead>
                  <tr>
                    <th>Produit ID</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productId}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice}€</td>
                      <td>{item.totalPrice}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
