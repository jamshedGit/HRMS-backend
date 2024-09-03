const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const CompensationExpModel = sequelize.define('t_compensation_expatriate_policy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	gradeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    employeeTypeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    currencyId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    nationalityId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    isVisaSponsorShipStatus : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    visaSponsorshipStatus : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    isAirTicket : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    isExitFees : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    noOfFamilyMembers : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
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

module.exports = CompensationExpModel;