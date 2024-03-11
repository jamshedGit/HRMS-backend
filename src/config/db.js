const Sequelize = require("sequelize");
const logger = require("./logger");

var sequelize;
try {
  sequelize = new Sequelize({
    // Deploy Databse Connection
    // database: "d7qc8bukkodtsn",
    //     username: "rzlxhcjausmazc",
    //     password: "ebbd35720be2186b3718b7c56a124cfd50733e290cd331db062db01017c3faff",
    //     host: "ec2-3-219-52-220.compute-1.amazonaws.com",
    // database: "EAMS_LIVE_DB",
    // username: "postgres", //Arsal1997   arsalans credentials
    // password: "Dynasoft@1", //pSlC3yjUvd5t
    // host: "localhost", //ep-little-math-774305.us-east-2.aws.neon.tech
    // port: 5432, 
    // dialect: "postgres",

    // database: "EAMS_LIVE_DB",
    // username: "postgres", //Arsal1997   arsalans credentials
    // password: "Dynasoft@1", //pSlC3yjUvd5t
    // host: "localhost", //ep-little-math-774305.us-east-2.aws.neon.tech
    // port: 5432,
    // dialect: "postgres",

    database: "edu_example_db",
    username: "edu_example_db_user", //Arsal1997   arsalans credentials
    password: "sT3s2dyVQp6gf7YvMkoLXubiFFdsuIL7", //pSlC3yjUvd5t
    host: "dpg-cnn8ktuv3ddc73fn9650-a.oregon-postgres.render.com", //ep-little-math-774305.us-east-2.aws.neon.tech
    port: 5432,
    dialect: "postgres",

    logging:false,
    dialectOptions: {
      ssl: {
        require: false, // This will help you. But you will see nwe error
        rejectUnauthorized: false // This line will fix new error
      }
    },
    
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
