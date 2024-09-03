const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const ExperienceModel = sequelize.define('t_employee_work_experience', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	employeeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	companyName : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	positionHeld : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    countryId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    cityId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    startDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    endDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
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

module.exports = ExperienceModel;