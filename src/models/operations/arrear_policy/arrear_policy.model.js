const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const ArrearPolicyModel = sequelize.define('t_arrear_policy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.NUMBER, allowNull: true },
	companyId: { type: Sequelize.NUMBER, allowNull: true },
	type: { type: Sequelize.STRING, allowNull: false },
	divisor: { type: Sequelize.STRING, defaultValue: '' },
	multiplier: { type: Sequelize.STRING, defaultValue: '' },
	days: { type: Sequelize.STRING, defaultValue: '' },
	type_name: { type: Sequelize.STRING, allowNull: true },
	isActive: { type: Sequelize.NUMBER, allowNull: true, defaultValue: 1 },
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

module.exports = ArrearPolicyModel;