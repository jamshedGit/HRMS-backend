const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const Model = sequelize.define('t_loan_type_setup', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	code : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	name  : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	linkedAttendance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	mapped : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
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

module.exports = Model;