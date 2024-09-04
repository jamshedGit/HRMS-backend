const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const BankModel = sequelize.define('t_employee_academic_info', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	employeeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    degreeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    institutionId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    countryId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    cityId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    startDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    endDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    gpa : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    statusId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    attachment : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
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

module.exports = BankModel;