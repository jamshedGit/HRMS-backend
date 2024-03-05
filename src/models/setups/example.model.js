// const sequelize = require("../../index.js").sequelize;
const {postgresClient} = require("../../index.js");
const { Sequelize, DataTypes } = require("sequelize");
//  const sequelize = require("../../index.js");

 console.log(postgresClient);

// //  /**
// //   * Import the Sequelize instance that you have exported
// //   * in the config/database.js file.
// //   */
//  const sequelize = require("../index");
 
 /**
  * Define a model that can be managed by Sequelize.
  */
 const Example = sequelize.define(
     "example",
     {
         id: {
             type: DataTypes.INTEGER,
             autoIncrement: true,
             allowNull: false,
             primaryKey: true,
         },
         name: {
             type: DataTypes.STRING,
             allowNull: false,
         },
        //  subtitle: {
        //      type: DataTypes.STRING,
        //      allowNull: false,
        //  },
        //  content: {
        //      type: DataTypes.STRING,
        //      allowNull: true,
        //  },
     }
 );
 
// //  /**
// //   * Export the model, so that it can be used in any
// //   * page to execute CRUD operations on the example table.
// //   */
  module.exports = Example;