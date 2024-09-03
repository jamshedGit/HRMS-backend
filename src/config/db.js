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
