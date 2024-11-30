const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')
const parentModel = require('../payroll_policy/payroll_policy.model');

const eobi_allowances = sequelize.define('tran_payroll_policy_eobiAllowances', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	payrollConfigurationId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	earningId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	createdAt: { type: Sequelize.DATE, allowNull: true },
	updatedAt: { type: Sequelize.DATE, allowNull: true },

});

parentModel.hasMany(eobi_allowances, { foreignKey: 'payrollConfigurationId' });

eobi_allowances.belongsTo(parentModel, {
	foreignKey: 'payrollConfigurationId',
	targetKey: 'Id',
	
});


module.exports = eobi_allowances;