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
    logging: false,
    define: {
      freezeTableName: true,
      modelName: 'singularName'
    },

    // database: "dsc_hrms_staging",
    // username: "root", //Arsal1997   arsalans credentials
    // password: "", //pSlC3yjUvd5t
    // host: "localhost", //ep-little-math-774305.us-east-2.aws.neon.tech
    // port: 3306,
    // dialect: "mysql",
    // logging: true,
    // dialectOptions: {
    //   // ssl: {
    //   //   require: false, // This will help you. But you will see nwe error
    //   //   rejectUnauthorized: false // This line will fix new error
    //   // }
    // },




    //================================
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
      freezeTableName: true,
    },
  
  });

  sequelize.authenticate();
  logger.info('Connected to Postgres.');
} catch (error) {
  logger.error("DB Connection Error", error);
}

module.exports = sequelize;
