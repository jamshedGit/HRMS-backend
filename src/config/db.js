const Sequelize = require("sequelize");
const logger = require("./logger");

var sequelize;
try {
  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: true,
    dialectOptions: {
      // ssl: {
      //   require: false, // This will help you. But you will see nwe error
      //   rejectUnauthorized: false // This line will fix new error
      // } 
    },
    define: {
      freezeTableName: true,
    },
  });

  sequelize.authenticate();
  logger.info('Connected to Postgres.');
} catch (error) {
  logger.error("DB Connection Error", error);
}

module.exports = sequelize;
