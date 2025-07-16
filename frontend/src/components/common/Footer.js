import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="logo-icon">☕</span>
              Café Délice
            </h3>
            <p className="footer-description">
              Votre destination pour les meilleurs cafés et boissons
              artisanales. Savourez l'excellence à chaque gorgée.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
              <li>
                <Link to="/about">À propos</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <div className="contact-info">
              <p>📍 123 Rue du Café, Paris</p>
              <p>📞 01 23 45 67 89</p>
              <p>✉️ contact@cafedelice.fr</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Horaires</h4>
            <div className="hours-info">
              <p>Lundi - Vendredi: 7h00 - 19h00</p>
              <p>Samedi: 8h00 - 20h00</p>
              <p>Dimanche: 8h00 - 18h00</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Café Délice. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
