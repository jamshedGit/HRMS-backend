const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmpTransferModel = sequelize.define('t_employee_transfer', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	transferCategory: { type: Sequelize.STRING, allowNull: true },
	employeeId: { type: Sequelize.NUMBER, allowNull: true },
	transferType: { type: Sequelize.STRING, allowNull: true },
	transferDate: { type: Sequelize.DATE, allowNull: true },
	tillTransferDate: { type: Sequelize.DATE, allowNull: true },
	IsTemporaryTransfer: { type: Sequelize.BOOLEAN, allowNull: true },
	transferRemarks: { type: Sequelize.STRING, allowNull: true },
	subsidiaryId: { type: Sequelize.NUMBER, allowNull: true },
	companyId: { type: Sequelize.NUMBER, allowNull: true },
	designationId: { type: Sequelize.NUMBER, allowNull: true },
	gradeId: { type: Sequelize.NUMBER, allowNull: true },
	defaultShiftId: { type: Sequelize.NUMBER, allowNull: true },
	
	teamId: { type: Sequelize.NUMBER, allowNull: true },
	payrollGroupId: { type: Sequelize.NUMBER, allowNull: true },
	regionId: { type: Sequelize.NUMBER, allowNull: true },
	// religionId: { type: Sequelize.NUMBER, allowNull: true },
	employeeTypeId: { type: Sequelize.NUMBER, allowNull: true },
	locationId: { type: Sequelize.NUMBER, allowNull: true },
	countryId: { type: Sequelize.NUMBER, allowNull: true },
	cityId: { type: Sequelize.NUMBER, allowNull: true },
	reportTo: { type: Sequelize.NUMBER, allowNull: true },

	employeeTypeId_To: { type: Sequelize.NUMBER, allowNull: true },

	companyId_To: { type: Sequelize.NUMBER, allowNull: true },

	subsidiaryId_To: { type: Sequelize.NUMBER, allowNull: true },

	departmentId_To: { type: Sequelize.NUMBER, allowNull: true },

	departmentId: { type: Sequelize.NUMBER, allowNull: true },

	gradeId_To: { type: Sequelize.NUMBER, allowNull: true },

	designationId_To: { type: Sequelize.NUMBER, allowNull: true },

	locationId_To: { type: Sequelize.NUMBER, allowNull: true },

	regionId_To: { type: Sequelize.NUMBER, allowNull: true },

	cityId_To: { type: Sequelize.NUMBER, allowNull: true },

	countryId_To: { type: Sequelize.NUMBER, allowNull: true },

	payrollGroupId_To: { type: Sequelize.NUMBER, allowNull: true },

	defaultShiftId_To: { type: Sequelize.NUMBER, allowNull: true },

	reportTo_To: { type: Sequelize.NUMBER, allowNull: true },

	teamId_To: { type: Sequelize.NUMBER, allowNull: true },


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



module.exports = EmpTransferModel;