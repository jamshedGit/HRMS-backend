const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EarningModel = sequelize.define('t_employee_earning', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	//employeeId: { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	earningCode : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	earningName : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	linkedAttendance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	isTaxable: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	mappedAllowance : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
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

module.exports = EarningModel;