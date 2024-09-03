const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const Model = sequelize.define('t_compensation_earning_deduction', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	subsidiaryId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	compensation_benefits_Id: { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    earning_deduction_id : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    transactionType : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    calculation_type : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    factorValue : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    isPartOfGrossSalary: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
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

module.exports = Model;