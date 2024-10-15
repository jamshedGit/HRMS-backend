const Sequelize = require("sequelize");
const { ResourceModel } = require("../..");
const Loan_management_configurationModel = require('../../index');
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
  basis: { type: Sequelize.INTEGER, allowNull: false },
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


Loan_management_detail.belongsTo(Loan_management_configurationModel.Loan_management_configurationModel, {
  foreignKey: 'loan_management_configurationId',
  targetKey: 'Id', // Optional alias
});



Loan_management_configurationModel.Loan_management_configurationModel.hasMany(Loan_management_detail, {
	as: 'Details',foreignKey: 'loan_management_configurationId',

});



module.exports = Loan_management_detail;
