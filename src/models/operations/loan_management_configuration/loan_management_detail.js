const Sequelize = require("sequelize");
const { ResourceModel } = require("../..");

//import Database connection configurations.
const sequelize = require("../../../config/db");

const Loan_management_detail = sequelize.define("t_loan_management_detail", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  loan_management_configurationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  loan_typeId: { type: Sequelize.INTEGER },
  max_loan_amount: { type: Sequelize.INTEGER, allowNull: false },
  basis: { type: Sequelize.STRING, allowNull: false },
  salary_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  createdAt: { type: Sequelize.DATE, allowNull: true },
  updatedAt: { type: Sequelize.DATE, allowNull: true },
});

module.exports = Loan_management_detail;
