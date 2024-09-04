const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const DesigModel = sequelize.define('t_employee_profile', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.NUMBER, allowNull: true },
	gradeId: { type: Sequelize.NUMBER, allowNull: true },
	title: { type: Sequelize.STRING, allowNull: true },
	firstName: { type: Sequelize.STRING, allowNull: true },
	middleName: { type: Sequelize.STRING, allowNull: true },
	lastName: { type: Sequelize.STRING, allowNull: true },
	employeeCode: { type: Sequelize.STRING, allowNull: true },
	title: { type: Sequelize.STRING, allowNull: true },
	profile_image: { type: Sequelize.STRING, allowNull: true },
	nic_no: { type: Sequelize.STRING, allowNull: true },
	passportNo: { type: Sequelize.STRING, allowNull: true },
	maritalStatus: { type: Sequelize.STRING, allowNull: true },
	gender: { type: Sequelize.STRING, allowNull: true },
	nationality: { type: Sequelize.STRING, allowNull: true },
	email_official: { type: Sequelize.STRING, allowNull: true },
	email_personal: { type: Sequelize.STRING, allowNull: true },
	phone_home: { type: Sequelize.STRING, allowNull: true },
	phone_official: { type: Sequelize.STRING, allowNull: true },
	phone_cell: { type: Sequelize.STRING, allowNull: true },
	professional_summary: { type: Sequelize.STRING, allowNull: true },
	additional_summary: { type: Sequelize.STRING, allowNull: true },
	status: { type: Sequelize.STRING, allowNull: true },
	departmentId: { type: Sequelize.NUMBER, allowNull: true },
	teamId: { type: Sequelize.NUMBER, allowNull: true },
	payrollGroupId: { type: Sequelize.NUMBER, allowNull: true },
	regionId: { type: Sequelize.NUMBER, allowNull: true },
	religionId: { type: Sequelize.NUMBER, allowNull: true },
	employeeTypeId: { type: Sequelize.NUMBER, allowNull: true },
	locationId: { type: Sequelize.NUMBER, allowNull: true },
	countryId: { type: Sequelize.NUMBER, allowNull: true },
	cityId: { type: Sequelize.NUMBER, allowNull: true },
	reportTo: { type: Sequelize.NUMBER, allowNull: true },
	dateOfJoining: { type: Sequelize.DATE, allowNull: true },
	dateOfConfirmation: { type: Sequelize.DATE, allowNull: true },
	dateOfConfirmationDue: { type: Sequelize.DATE, allowNull: true },
	dateOfConfirmationEnter: { type: Sequelize.DATE, allowNull: true },
	dateOfContractExpiry: { type: Sequelize.DATE, allowNull: true },
	defaultShiftId: { type: Sequelize.NUMBER, allowNull: true },
	attendanceType: { type: Sequelize.NUMBER, allowNull: true },
	dateOfBirth: { type: Sequelize.DATE, allowNull: true },
	dateOfRetirement: { type: Sequelize.DATE, allowNull: true },
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



module.exports = DesigModel;