const { Sequelize } = require("sequelize");

const requiredEnvVars = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Variables d'environnement manquantes:", missingVars);
  process.exit(1);
}

const dbName = process.env.DB_NAME;
if (!/^\w+$/.test(dbName)) {
  throw new Error("Nom de base de données invalide !");
}
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT);

const sequelizeWithoutDb = new Sequelize("", dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
});

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: console.log,
  retry: { max: 3 },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    console.log("🔄 Création de la base si elle n'existe pas...");
    await sequelizeWithoutDb.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`
    );
    console.log(`✅ Base '${dbName}' créée ou déjà existante`);

    console.log(`🔄 Connexion à MySQL: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
    await sequelize.authenticate();
    console.log("✅ MySQL connecté (Order Service)");
  } catch (err) {
    console.error("❌ Erreur connexion MySQL:");
    console.error("Code d'erreur:", err.original?.code);
    console.error("Message:", err.message);
    throw err;
  }
};

module.exports = {
  sequelize,
  connectDB,
};
//commentszzzz