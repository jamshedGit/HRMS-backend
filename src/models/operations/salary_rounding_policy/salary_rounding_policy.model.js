const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { FormModel } = require('../..');

const RoundingPolicyModel = sequelize.define('t_salary_rounding_policy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.NUMBER, allowNull: true },
	companyId: { type: Sequelize.NUMBER, allowNull: true },
	paymentMode: { type: Sequelize.NUMBER, allowNull: false },
	amount: { type: Sequelize.STRING, allowNull: false  },
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

RoundingPolicyModel.belongsTo(FormModel,{
    foreignKey:'paymentMode',
    targetKey: 'Id'
});

module.exports = RoundingPolicyModel;