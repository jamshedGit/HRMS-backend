const Sequelize = require('sequelize');
const { ResourceModel, SubsidiaryModel, FormModel, DesignationModel, DeptModel, RegionModel, ReligionModel, CountryModel, CityModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmployeeProfileModel = sequelize.define('t_employee_profile', {
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
	maritalStatus: { type: Sequelize.INTEGER, allowNull: true },
	gender: { type: Sequelize.INTEGER, allowNull: true },
	nationality: { type: Sequelize.INTEGER, allowNull: true },
	email_official: { type: Sequelize.STRING, allowNull: true },
	email_personal: { type: Sequelize.STRING, allowNull: true },
	phone_home: { type: Sequelize.STRING, allowNull: true },
	phone_official: { type: Sequelize.STRING, allowNull: true },
	phone_cell: { type: Sequelize.STRING, allowNull: true },
	professional_summary: { type: Sequelize.STRING, allowNull: true },
	additional_summary: { type: Sequelize.STRING, allowNull: true },
	status: { type: Sequelize.INTEGER, allowNull: true },
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
	attendanceType: { type: Sequelize.INTEGER, allowNull: true },
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

SubsidiaryModel.hasMany(EmployeeProfileModel, { foreignKey: 'subsidiaryId' });
EmployeeProfileModel.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'gradeId',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
	as: 'grade'
});

EmployeeProfileModel.belongsTo(DesignationModel, {
    foreignKey: 'designationId',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'maritalStatus',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
	as: 'marital'
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'gender',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
	as: 'genders'
});

EmployeeProfileModel.belongsTo(DeptModel, {
    foreignKey: 'departmentId',
    targetKey: 'deptId', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'teamId',
    targetKey: 'Id', 
	as: 'team',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'payrollGroupId',
    targetKey: 'Id', 
	as: 'payrollGroup',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'regionId',
    targetKey: 'Id', 
	as: 'region',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'religionId',
    targetKey: 'Id', 
	as: 'religion',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'employeeTypeId',
    targetKey: 'Id', 
	as: 'employeeType',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(FormModel, {
    foreignKey: 'nationality',
    targetKey: 'Id', 
	as: 'national',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(CountryModel, {
    foreignKey: 'countryId',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(CityModel, {
    foreignKey: 'cityId',
    targetKey: 'id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

EmployeeProfileModel.belongsTo(EmployeeProfileModel, {
    foreignKey: 'reportTo',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

module.exports = EmployeeProfileModel;