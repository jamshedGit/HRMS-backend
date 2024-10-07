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
	type: { type: Sequelize.NUMBER, allowNull: true },
	divisor: { type: Sequelize.NUMBER, allowNull: true },
	multiplier: { type: Sequelize.NUMBER, allowNull: true },
	days: { type: Sequelize.NUMBER, allowNull: true },
	type_name: { type: Sequelize.NUMBER, allowNull: true },
	isActive: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
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