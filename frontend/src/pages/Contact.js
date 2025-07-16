import React, { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Votre demande a été envoyée avec succès!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Contactez-nous</h1>
          <p className="page-subtitle">
            Notre équipe commerciale est à votre disposition pour tous vos
            besoins
          </p>
        </div>

        <div className="contact-content">
          {/* Informations de contact */}
          <div className="contact-info">
            <h2>Nos Coordonnées</h2>

            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h3>Adresse</h3>
                <p>
                  Zone Industrielle des Cafés
                  <br />
                  15 Avenue du Commerce
                  <br />
                  94300 Vincennes, France
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h3>Téléphone</h3>
                <p>
                  <strong>Commercial:</strong> 01 48 75 92 84
                  <br />
                  <strong>Commandes:</strong> 01 48 75 92 85
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>
                  <strong>Commercial:</strong> commercial@cafedelice.fr
                  <br />
                  <strong>Commandes:</strong> commandes@cafedelice.fr
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <div className="contact-details">
                <h3>Horaires Bureau</h3>
                <div className="hours-list">
                  <p>
                    <strong>Lundi - Vendredi:</strong> 8h00 - 18h00
                  </p>
                  <p>
                    <strong>Samedi:</strong> 8h00 - 12h00
                  </p>
                  <p>
                    <strong>Dimanche:</strong> Fermé
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🚚</div>
              <div className="contact-details">
                <h3>Livraisons</h3>
                <div className="delivery-info">
                  <p>
                    <strong>France métropolitaine:</strong> 24-48h
                  </p>
                  <p>
                    <strong>Europe:</strong> 3-5 jours
                  </p>
                  <p>
                    <strong>Retrait entrepôt:</strong> Sur RDV
                  </p>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="social-links">
              <h3>Suivez-nous</h3>
              <div className="social-icons">
                <a href="#" className="social-link">
                  📘 LinkedIn
                </a>
                <a href="#" className="social-link">
                  📷 Instagram
                </a>
                <a href="#" className="social-link">
                  🐦 Twitter
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="contact-form">
            <h2>Demande de Devis / Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="01 23 45 67 89"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company" className="form-label">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Type de demande *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choisissez un type</option>
                  <option value="devis">Demande de devis</option>
                  <option value="info">Information produit</option>
                  <option value="commande">Commande en gros</option>
                  <option value="partenariat">Partenariat commercial</option>
                  <option value="livraison">Question livraison</option>
                  <option value="qualite">Contrôle qualité</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Décrivez votre demande (quantités, variétés souhaitées, délais, etc.)"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Envoyer la demande"}
              </button>
            </form>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="faq-section">
          <h2>Questions Fréquentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Quelle est la quantité minimale de commande ?</h3>
              <p>
                Nous acceptons les commandes à partir de 5kg pour les
                professionnels et 250g pour les particuliers. Des tarifs
                dégressifs s'appliquent dès 25kg.
              </p>
            </div>
            <div className="faq-item">
              <h3>Proposez-vous des échantillons ?</h3>
              <p>
                Oui, nous envoyons des échantillons gratuits de 50g sur demande
                pour vous permettre de tester nos cafés avant commande.
              </p>
            </div>
            <div className="faq-item">
              <h3>Quels sont vos délais de livraison ?</h3>
              <p>
                24-48h en France métropolitaine pour les commandes en stock.
                Livraison express possible sous 24h pour les commandes urgentes.
              </p>
            </div>
            <div className="faq-item">
              <h3>Avez-vous des certifications qualité ?</h3>
              <p>
                Tous nos cafés sont certifiés bio, commerce équitable et
                analysés en laboratoire. Nous fournissons les certificats avec
                chaque commande.
              </p>
            </div>
          </div>
        </div>

        {/* Section Localisation */}
        <div className="location-section">
          <h2>Notre Entrepôt</h2>
          <div className="location-content">
            <div className="map-placeholder">
              <div className="map-info">
                <p>
                  📍 Zone Industrielle des Cafés, 15 Avenue du Commerce, 94300
                  Vincennes
                </p>
                <p>🚇 RER: Vincennes (ligne A) - 10 min en bus</p>
                <p>🚌 Bus: 56, 115, 124</p>
                <p>🚗 Parking poids lourds disponible</p>
                <p>⏰ Retrait sur RDV: Lundi-Vendredi 8h-17h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
