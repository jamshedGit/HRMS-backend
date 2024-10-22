const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const Model = sequelize.define('tran_payroll_policy_bank_info', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	payrollConfigurationId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	journalBankAccountId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	bankCode: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	bankName: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	bankAccountNo: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	isDefault: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	createdAt: { type: Sequelize.DATE, allowNull: true },
	updatedAt: { type: Sequelize.DATE, allowNull: true },
});

module.exports = Model;