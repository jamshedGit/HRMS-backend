const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, CompanyModel, SubsidiaryModel, Employee_ShiftModel } = require('../..');
const { formatDates } = require('../../../utils/common');

const employeeRosterModel = sequelize.define('t_employee_roster', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true },
	employeeId: { type: Sequelize.INTEGER, allowNull: false },
	from: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('from');
			return typeof rawValue != 'undefined' ? formatDates(rawValue) : null;
		}
	},
	to: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('to');
			return typeof rawValue != 'undefined' ? formatDates(rawValue) : null;
		}
	},
	shiftId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: 1 },
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

// Association with EmployeeProfileModel model (employeeId is a foreign key)
EmployeeProfileModel.hasMany(employeeRosterModel, { foreignKey: 'employeeId' });
employeeRosterModel.belongsTo(EmployeeProfileModel, {
	foreignKey: 'employeeId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeProfileModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with Employee_ShiftModel model (shiftId is a foreign key)
employeeRosterModel.belongsTo(Employee_ShiftModel, {
	foreignKey: 'shiftId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in Employee_ShiftModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(employeeRosterModel, { foreignKey: 'subsidiaryId' });
employeeRosterModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(employeeRosterModel, { foreignKey: 'companyId' });
employeeRosterModel.belongsTo(CompanyModel, {
	foreignKey: 'companyId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});


module.exports = employeeRosterModel;
