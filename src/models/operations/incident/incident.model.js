const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const IncidentModel = sequelize.define('T_employee_incident', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	employeeId: { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	incidentDetail: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	date: { type: Sequelize.DATE, allowNull: true, defaultValue: true },
	actionTaken: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	actionTakenBy: { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
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

module.exports = IncidentModel;