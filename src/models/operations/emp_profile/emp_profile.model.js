const Sequelize = require('sequelize');
const { ResourceModel, DeptModel, FormModel, SubsidiaryModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const DesigModel = sequelize.define('t_employee_profile', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	gradeId: { type: Sequelize.INTEGER, allowNull: true },
	designationId: { type: Sequelize.INTEGER, allowNull: true },
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
	departmentId: { type: Sequelize.INTEGER, allowNull: true },
	teamId: { type: Sequelize.INTEGER, allowNull: true },
	payrollGroupId: { type: Sequelize.INTEGER, allowNull: true },
	regionId: { type: Sequelize.INTEGER, allowNull: true },
	religionId: { type: Sequelize.INTEGER, allowNull: true },
	employeeTypeId: { type: Sequelize.INTEGER, allowNull: true },
	locationId: { type: Sequelize.INTEGER, allowNull: true },
	countryId: { type: Sequelize.INTEGER, allowNull: true },
	cityId: { type: Sequelize.INTEGER, allowNull: true },
	reportTo: { type: Sequelize.INTEGER, allowNull: true },
	dateOfJoining: { type: Sequelize.DATE, allowNull: true },
	dateOfConfirmation: { type: Sequelize.DATE, allowNull: true },
	dateOfConfirmationDue: { type: Sequelize.DATE, allowNull: true },
	dateOfConfirmationEnter: { type: Sequelize.DATE, allowNull: true },
	dateOfContractExpiry: { type: Sequelize.DATE, allowNull: true },
	defaultShiftId: { type: Sequelize.INTEGER, allowNull: true },
	attendanceType: { type: Sequelize.INTEGER,  defaultValue: true },
	dateOfBirth: { type: Sequelize.DATE, allowNull: true },
	dateOfRetirement: { type: Sequelize.DATE, allowNull: true },
	salesRep: { type: Sequelize.BOOLEAN, allowNull: true },
	supportRep: { type: Sequelize.BOOLEAN, allowNull: true },
	sourceOfHire: { type: Sequelize.STRING, allowNull: true },
	lastReviewDate: { type: Sequelize.DATE, allowNull: true },
	nextReviewDate: { type: Sequelize.DATE, allowNull: true },
	laborCardNo: { type: Sequelize.STRING, allowNull: true },
	drivingLicenseExpiry: { type: Sequelize.DATE, allowNull: true },
	emiratesId: { type: Sequelize.STRING, allowNull: true },
	emiratesNo: { type: Sequelize.STRING, allowNull: true },
	passportExpiry: { type: Sequelize.DATE, allowNull: true },
	nicExpiry: { type: Sequelize.DATE, allowNull: true },
	deligation: { type: Sequelize.STRING, allowNull: true },
	personId: { type: Sequelize.INTEGER, allowNull: true },
	routingCode: { type: Sequelize.STRING, allowNull: true },
	contractTypeId: { type: Sequelize.INTEGER, allowNull: true },
	cycleTypeId: { type: Sequelize.INTEGER, allowNull: true },
	requireDeligation: { type: Sequelize.BOOLEAN, allowNull: true },

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

DesigModel.belongsTo(DeptModel, {
	foreignKey: 'departmentId',
	targetKey: 'deptId',
	as: "department"
});


DesigModel.belongsTo(FormModel, {
	foreignKey: 'designationId',
	targetKey: 'Id',
	as: "designation"
});

DesigModel.belongsTo(FormModel, {
	foreignKey: 'employeeTypeId',
	targetKey: 'Id',
	as: "employeeType"
});

DesigModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
});




module.exports = DesigModel;