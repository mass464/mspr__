const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

// CHARGER .env EN PREMIER
dotenv.config();

// DEBUG: Afficher les variables d'environnement
console.log("=== VARIABLES D'ENVIRONNEMENT ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***" : "NON DÉFINI");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("===============================");

const { connectDB } = require("./config/db");
const { initializeProductModel } = require("./models/product.model");
const productRoutes = require("./routes/product.routes");
const client = require("prom-client");
const { connectAndListenRabbitMQ, publishEvent, rabbitmqPublishCounter, rabbitmqConsumeCounter } = require('./rabbitmq');

const app = express();

// Fonction d'initialisation avec gestion d'erreurs
const initDatabase = async () => {
  try {
    console.log("🔄 Initialisation de la base de données...");
    await connectDB();
    await initializeProductModel();
    console.log("✅ Base de données initialisée");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de la DB:",
      error.message
    );
    throw error;
  }
};

// Métriques Prometheus
client.collectDefaultMetrics();

// Enregistrer les métriques RabbitMQ
client.register.registerMetric(rabbitmqPublishCounter);
client.register.registerMetric(rabbitmqConsumeCounter);

// === PROMETHEUS CUSTOM METRICS ===
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'code']
});
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

console.log('DEBUG: app.js démarre bien');
console.log('DEBUG: Avant appel connectAndListenRabbitMQ');

// === RabbitMQ events ===
connectAndListenRabbitMQ(async (event) => {
  if (event.type === 'order_deleted') {
    const { items } = event.data;
    const { Product } = require('./models/product.model');
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        const newQuantity = product.quantity + item.quantity;
        await product.update({ quantity: newQuantity });
        console.log(`📦 Produit ${item.productId}: stock ré-incrémenté de ${item.quantity} (nouveau stock: ${newQuantity})`);
      } else {
        console.warn(`⚠️ Produit ${item.productId} non trouvé pour restock`);
      }
    }
    console.log(`✅ Restock terminé pour ${items.length} produit(s)`);
  }
  if (event.type === 'order_created') {
    // Décrémenter le stock pour chaque item de la commande
    const { items } = event.data;
    const { Product } = require('./models/product.model');
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        const newQuantity = product.quantity - item.quantity;
        await product.update({ quantity: newQuantity });
        console.log(`🛒 Produit ${item.productId}: stock décrémenté de ${item.quantity} (nouveau stock: ${newQuantity})`);
      } else {
        console.warn(`⚠️ Produit ${item.productId} non trouvé pour décrémentation`);
      }
    }
    console.log(`✅ Décrémentation du stock terminée pour ${items.length} produit(s)`);
  }
  if (event.type === 'product_deleted') {
    // Ici, tu pourrais ajouter une logique pour notifier ou nettoyer côté produit
    // Exemple : log ou suppression de données annexes
    console.log(`[CONSUMER] Event product_deleted reçu dans product-service :`, event.data);
    // (Optionnel) Ajouter un traitement métier ici
  }
  if (event.type === 'product_created') {
    // Exemple de traitement à l'arrivée d'un nouveau produit (log, synchro, etc.)
    console.log(`[CONSUMER] Event product_created reçu dans product-service :`, event.data);
    // (Optionnel) Ajouter un traitement métier ici
  }
});

console.log('DEBUG: Après appel connectAndListenRabbitMQ');

// Pour que le controller puisse publier des messages
module.exports.publishEvent = publishEvent;

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    const route = req.baseUrl + (req.route?.path || '');
    httpRequestCounter.inc({
      method: req.method,
      route: route,
      code: res.statusCode
    });
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      code: res.statusCode
    }, durationInSeconds);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', require('prom-client').register.contentType);
  res.end(await require('prom-client').register.metrics());
});

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "http://localhost:5001", // ← ton backend
          "http://localhost:3000",
          "http://localhost:3001",
          // ← ton frontend React
        ],
        connectSrc: [
          "'self'",
          "http://localhost:5001",
          "http://localhost:3000",
          "http://localhost:3001",
          // ← ton frontend React
        ],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(cors());
app.use(express.json());
// Sert les fichiers HTML/CSS/JS de ton frontend
app.use(express.static(path.join(__dirname, "public")));
// Sert les images produits depuis le dossier uploads (minuscule)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware 404 pour les images manquantes
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads/')) {
    return res.status(404).send('Image not found');
  }
  next();
});

// Routes
app.use("/api/products", productRoutes);

// Health check détaillé
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "product-service",
    timestamp: new Date().toISOString(),
    env: {
      port: process.env.PORT,
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbName: process.env.DB_NAME,
    },
  });
});
// Toutes les routes autres que l'API → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware de gestion d'erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);

  // Gestion spécifique des erreurs Multer
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Fichier trop volumineux (max 5MB)" });
    }
    return res.status(400).json({ error: "Erreur d'upload: " + err.message });
  }

  // Gestion des erreurs de validation de fichier
  if (err.message.includes("Seules les images sont autorisées")) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ msg: "Erreur serveur", error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5001;

// Démarrage avec retry logic
const startServer = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await initDatabase();
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Product-service démarré sur http://localhost:${PORT}`);
        console.log(
          `📁 Images accessibles sur http://localhost:${PORT}/uploads/`
        );
      });
    } catch (error) {
      console.error(`❌ Tentative ${i + 1}/${retries} échouée:`, error.message);
      if (i === retries - 1) {
        console.error(
          "❌ Impossible de démarrer le service après",
          retries,
          "tentatives"
        );
        process.exit(1);
      }
      console.log("⏳ Nouvelle tentative dans 5 secondes...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// startServer();
module.exports = app;