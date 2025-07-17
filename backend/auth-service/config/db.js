const { Sequelize } = require("sequelize");

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);

const dbName = process.env.DB_NAME;
if (!/^\w+$/.test(dbName)) {
  throw new Error("Nom de base de données invalide !");
}
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

const sequelizeWithoutDb = new Sequelize("", dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  logging: false,
});

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    // 1) Connexion sans DB pour créer la base si besoin
    await sequelizeWithoutDb.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`
    );
    console.log(`✅ Base de données '${dbName}' créée ou déjà existante`);

    // 2) Connexion sur la base
    await sequelize.authenticate();
    console.log("✅ MySQL connecté à la base", dbName);
  } catch (err) {
    console.error("❌ Erreur connexion MySQL:", err);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};
//commenteed