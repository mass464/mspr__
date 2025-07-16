import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Section Hero */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="page-title">À Propos de Café Délice</h1>
            <p className="page-subtitle">
              Votre grossiste spécialisé dans la distribution de café en poudre
              premium depuis 2020
            </p>
          </div>
        </section>

        {/* Section Histoire */}
        <section className="our-story">
          <div className="story-content">
            <div className="story-text">
              <h2>Notre Histoire</h2>
              <p>
                Fondé en 2020 par Marie et Pierre Dubois, Café Délice est né
                d'une passion pour l'excellence et d'une vision claire :
                démocratiser l'accès aux meilleurs cafés du monde. Après des
                années d'expérience dans l'import-export, nous avons créé cette
                entreprise pour connecter directement les producteurs aux
                consommateurs.
              </p>
              <p>
                Aujourd'hui, nous sommes un acteur majeur de la distribution de
                café en poudre, proposant plus de 80 variétés différentes
                provenant de 15 pays. Notre expertise nous permet de garantir
                une qualité constante et des prix compétitifs pour tous nos
                clients, qu'ils soient professionnels ou particuliers.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <div className="coffee-beans">📦</div>
                <p>Nos fondateurs Marie & Pierre</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Valeurs */}
        <section className="our-values">
          <h2 className="section-title">Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Commerce Équitable</h3>
              <p>
                Nous travaillons directement avec les producteurs pour garantir
                des prix justes et des conditions de travail éthiques. Nos
                partenaires sont sélectionnés selon des critères stricts de
                développement durable.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3>Qualité Premium</h3>
              <p>
                Chaque lot de café est rigoureusement testé et certifié. Nous
                contrôlons la chaîne de production de la plantation jusqu'à la
                livraison pour maintenir des standards élevés.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚚</div>
              <h3>Service Client</h3>
              <p>
                Livraisons rapides, conditionnement sur mesure, conseils
                personnalisés. Notre équipe commerciale vous accompagne pour
                trouver les cafés parfaits selon vos besoins.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">💰</div>
              <h3>Prix Compétitifs</h3>
              <p>
                Grâce à nos volumes d'achat et nos relations directes avec les
                producteurs, nous proposons des tarifs dégressifs attractifs
                pour tous types de commandes.
              </p>
            </div>
          </div>
        </section>

        {/* Section Équipe */}
        <section className="our-team">
          <h2 className="section-title">Notre Équipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">👩‍💼</div>
              <h3>Marie Dubois</h3>
              <p className="member-role">Co-fondatrice & Directrice Générale</p>
              <p className="member-description">
                Spécialiste en sourcing international avec 15 ans d'expérience.
                Marie supervise la sélection des fournisseurs et la qualité des
                produits.
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo">👨‍💼</div>
              <h3>Pierre Dubois</h3>
              <p className="member-role">Co-fondateur & Directeur Commercial</p>
              <p className="member-description">
                Expert en torréfaction et développement commercial. Pierre gère
                les relations clients et développe notre réseau de distribution.
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo">👨‍🔬</div>
              <h3>Antoine Moreau</h3>
              <p className="member-role">Responsable Qualité</p>
              <p className="member-description">
                Ingénieur agronome spécialisé dans l'analyse sensorielle.
                Antoine supervise tous les contrôles qualité et les
                certifications.
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo">👩‍💼</div>
              <h3>Sophie Leroy</h3>
              <p className="member-role">Responsable Logistique</p>
              <p className="member-description">
                Experte en supply chain internationale. Sophie coordonne les
                expéditions et optimise nos processus de distribution.
              </p>
            </div>
          </div>
        </section>

        {/* Section Process */}
        <section className="our-process">
          <h2 className="section-title">Notre Processus</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Sourcing</h3>
              <p>
                Nous sélectionnons nos fournisseurs directement dans les pays
                producteurs en privilégiant qualité, traçabilité et commerce
                équitable.
              </p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Torréfaction</h3>
              <p>
                Torréfaction artisanale dans notre atelier selon des profils
                spécifiques pour chaque origine, préservant les arômes naturels
                du café.
              </p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Conditionnement</h3>
              <p>
                Broyage et conditionnement sous vide dans des emballages
                étanches pour préserver la fraîcheur. Formats disponibles de
                250g à 25kg.
              </p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Distribution</h3>
              <p>
                Livraison rapide via notre réseau logistique optimisé.
                Expédition sous 24h pour les commandes passées avant 14h.
              </p>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="about-cta">
          <div className="cta-content">
            <h2>Prêt à Commander ?</h2>
            <p>
              Découvrez notre catalogue complet et bénéficiez de nos tarifs
              dégressifs pour vos commandes en gros.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                Demander un Devis
              </Link>
              <Link to="/menu" className="btn btn-outline">
                Voir le Catalogue
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
