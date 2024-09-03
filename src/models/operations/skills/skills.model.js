const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const SkillsModel = sequelize.define('T_employee_skills', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	employeeId : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	skill : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	description : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	ratingScale : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	startDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
	endDate: { type: Sequelize.DATE, allowNull: true, defaultValue: true },
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

module.exports = SkillsModel;