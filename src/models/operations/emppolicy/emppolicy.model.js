const Sequelize = require('sequelize');
const { ResourceModel, SubsidiaryModel, FormModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmployeePolicyModel = sequelize.define('t_employeepolicy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	currencyId: { type: Sequelize.INTEGER, allowNull: true },
	isEmployeeCodeGenerationAuto: { type: Sequelize.BOOLEAN, allowNull: true },
	retirementAgeMale: { type: Sequelize.INTEGER, allowNull: true },
	retirementAgeFemale: { type: Sequelize.INTEGER, allowNull: true },
	minimumAge: { type: Sequelize.INTEGER, allowNull: true },
	maximumAge: { type: Sequelize.INTEGER, allowNull: true },
	pictureSizeLimit: { type: Sequelize.INTEGER, allowNull: true },
	pictureFilesSupport: { type: Sequelize.STRING, allowNull: true },
	documentSizeLimit: { type: Sequelize.INTEGER, allowNull: true },
	documentFilesSupport: { type: Sequelize.STRING, allowNull: true },
	empPictureIsMandatory: { type: Sequelize.BOOLEAN, allowNull: true },
	probationPolicyInMonth: { type: Sequelize.INTEGER, allowNull: true },
	contractualPolicyInMonth: { type: Sequelize.INTEGER, allowNull: true },
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

EmployeePolicyModel.belongsTo(FormModel, {
	foreignKey: 'currencyId',
	targetKey: 'Id',
		as:"Currency"
  });


  EmployeePolicyModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });




module.exports = EmployeePolicyModel;