const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmpSalaryExpModel = sequelize.define('t_employee_salary_expatriate', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
		
	employeeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    isVisaSponsorShipStatus : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    visaSponsorshipStatus : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    isAirTicket : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    airTicketAmount : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    remarks : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    countryId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    cityId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    noOfTicket : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    totalCost : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
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

module.exports = EmpSalaryExpModel;