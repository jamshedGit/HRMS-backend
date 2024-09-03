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
	subsidiaryId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    gradeId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    employeeTypeId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    currencyId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    salaryMethod : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    basicFactor : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    
    earningId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    deductionId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    gratuity_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    overtime_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    shift_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    regularity_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    punctuality_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    pf_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    eobi_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    social_security_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    pension_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
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