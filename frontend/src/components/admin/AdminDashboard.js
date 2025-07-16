import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard container">
      <h1>👑 Tableau de bord administrateur</h1>
      <div className="admin-sections">
        <Link to="/admin/products" className="admin-card">
          📦 Produits
        </Link>
        <Link to="/admin/orders" className="admin-card">
          🧾 Commandes
        </Link>
        <Link to="/admin/users" className="admin-card">
          👤 Utilisateurs
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
