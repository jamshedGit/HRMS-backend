const Sequelize = require('sequelize');
const {FormModel, SubsidiaryModel}= require('../../index');
const sequelize = require('../../../config/db')

const accrue_gratuity_configuration = sequelize.define('t_accrue_gratuity_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    subsidiaryId: { type: Sequelize.INTEGER,allowNull: false },
	companyId: { type: Sequelize.INTEGER,allowNull: false ,defaultValue: 1},
	graduity_expense_accountId: { type: Sequelize.INTEGER,allowNull: false },
	graduity_payable_accountId: { type: Sequelize.INTEGER,allowNull: false },
    bank_cash_accountId: { type: Sequelize.INTEGER,allowNull: false },
    
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


accrue_gratuity_configuration.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });

  
  accrue_gratuity_configuration.belongsTo(FormModel, {
	foreignKey: 'graduity_expense_accountId',
	targetKey: 'Id',
	as:"GraduityExpenseAccount"
  });

  accrue_gratuity_configuration.belongsTo(FormModel, {
	foreignKey: 'graduity_payable_accountId',
	targetKey: 'Id',
	as:"GraduityPayableAccount"
  });
  accrue_gratuity_configuration.belongsTo(FormModel, {
	foreignKey: 'bank_cash_accountId',
	targetKey: 'Id',
	as:"BankCashAccount"
  });




module.exports = accrue_gratuity_configuration;