const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const compensationModel = sequelize.define('t_compensation_benefits_policy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId : { type: Sequelize.INTEGER, allowNull: true },
    gradeId: { type: Sequelize.INTEGER, allowNull: true },
    employeeTypeId: { type: Sequelize.INTEGER, allowNull: true },
    currencyId : { type: Sequelize.INTEGER, allowNull: true },
    salaryMethod : { type: Sequelize.STRING, allowNull: true },
    basicFactor : { type: Sequelize.NUMBER, allowNull: true },
    
    earningId : { type: Sequelize.NUMBER, allowNull: true },
    deductionId : { type: Sequelize.NUMBER, allowNull: true },
    gratuity_member : { type: Sequelize.BOOLEAN, allowNull: true },
    overtime_allowance : { type: Sequelize.BOOLEAN, allowNull: true },
    overtime_working_day : { type: Sequelize.FLOAT, allowNull: true },
    overtime_off_day : { type: Sequelize.FLOAT, allowNull: true },
    overtime_holiday : { type: Sequelize.FLOAT, allowNull: true },
    shift_allowance : { type: Sequelize.BOOLEAN, allowNull: true },
    regularity_allowance : { type: Sequelize.BOOLEAN, allowNull: true },
    punctuality_allowance : { type: Sequelize.BOOLEAN, allowNull: true },
    pf_member : { type: Sequelize.BOOLEAN, allowNull: true },
    eobi_member : { type: Sequelize.BOOLEAN, allowNull: true },
    social_security_member : { type: Sequelize.BOOLEAN, allowNull: true },
    pension_member : { type: Sequelize.BOOLEAN, allowNull: true },
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

module.exports = compensationModel;