const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmployeePolicyModel = sequelize.define('T_EmployeePolicy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	policyName:  { type: Sequelize.STRING, allowNull: true },
	code:  { type: Sequelize.STRING, allowNull: true },
	
	subsdiaryId: { type: Sequelize.NUMBER, allowNull: true },
	currencyId: { type: Sequelize.NUMBER, allowNull: true },
	isEmployeeCodeGenerationAuto: { type: Sequelize.BOOLEAN, allowNull: true },
	retirementAgeMale: { type: Sequelize.NUMBER, allowNull: true },
	retirementAgeFemale: { type: Sequelize.NUMBER, allowNull: true },
	minimumAge: { type: Sequelize.NUMBER, allowNull: true },
	maximumAge: { type: Sequelize.NUMBER, allowNull: true },
	pictureSizeLimit: { type: Sequelize.NUMBER, allowNull: true },
	pictureFilesSupport: { type: Sequelize.STRING, allowNull: true },
	documentSizeLimit: { type: Sequelize.NUMBER, allowNull: true },
	documentFilesSupport: { type: Sequelize.STRING, allowNull: true },
	empPictureIsMandatory: { type: Sequelize.BOOLEAN, allowNull: true },
	probationPolicyInMonth: { type: Sequelize.NUMBER, allowNull: true },
	contractualPolicyInMonth: { type: Sequelize.NUMBER, allowNull: true },
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



module.exports = EmployeePolicyModel;