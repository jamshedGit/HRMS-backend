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
	type: { type: Sequelize.NUMBER, allowNull: false },
	divisor: { type: Sequelize.NUMBER, defaultValue: 0 },
	multiplier: { type: Sequelize.NUMBER, defaultValue: 0 },
	days: { type: Sequelize.NUMBER, defaultValue: 0 },
	type_name: { type: Sequelize.NUMBER, allowNull: true },
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