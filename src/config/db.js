const Sequelize = require("sequelize");
const logger = require("./logger");

var sequelize;
try {
  sequelize = new Sequelize({
    
    database: "sql10729008",
    username: "sql10729008", 
    password: "sMYzNnscZT", 
    host: "sql10.freemysqlhosting.net",
    port: 3306,
    dialect: "mysql",
    logging:false,
  
    
    // Localhost Database Connection
    // database: "EAMS2",
    // username: "postgres",
    // password: "postgresql",
    // host: "localhost",
    // port: 5432,
    // dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     require: true, // This will help you. But you will see new error
    //     rejectUnauthorized: false, // This line will fix new error
    //   },
    // },
    define: {
      // timestamps: true,
      freezeTableName: true,
    },
    // host: envVars.HOST,
    // port: envVars.DB_PORT,
    // database: envVars.DATABASE,
    // dialect: envVars.DIALECT,
    // username: envVars.USERNAME,
    // password: envVars.PASSWORD
  });

  sequelize.authenticate();
  logger.info('Connected to Postgres.');
} catch (error) {
  logger.error("DB Connection Error", error);
}

module.exports = sequelize;
