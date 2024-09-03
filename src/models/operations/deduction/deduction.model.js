const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const DeductionModel = sequelize.define('T_employee_deduction', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	deductionCode : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	deductionName : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	linkedAttendance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	loan: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	mappedDeduction : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	account : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
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

module.exports = DeductionModel;