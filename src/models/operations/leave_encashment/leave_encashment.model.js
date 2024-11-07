const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, CompanyModel, SubsidiaryModel, FiscalSetupModel } = require('../..');

const leaveEnchasmentModel = sequelize.define('t_leave_encashment', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true },
	employeeId: { type: Sequelize.INTEGER, allowNull: false },
	leaveType: { type: Sequelize.INTEGER, allowNull: false },
	yearId: { type: Sequelize.INTEGER, allowNull: false },
	days: { type: Sequelize.INTEGER, allowNull: false },
	reason: { type: Sequelize.STRING, allowNull: true },
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
EmployeeProfileModel.hasMany(leaveEnchasmentModel, { foreignKey: 'employeeId' });
leaveEnchasmentModel.belongsTo(EmployeeProfileModel, {
	foreignKey: 'employeeId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeProfileModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// // Association with LeaveTypeModel model (employeeId is a foreign key)
leaveEnchasmentModel.belongsTo(LeaveTypeModel, {
	foreignKey: 'leaveType',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// // Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(leaveEnchasmentModel, { foreignKey: 'subsidiaryId' });
leaveEnchasmentModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// // Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(leaveEnchasmentModel, { foreignKey: 'companyId' });
leaveEnchasmentModel.belongsTo(CompanyModel, {
	foreignKey: 'companyId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with FiscalSetupModel model (yearId is a foreign key)
leaveEnchasmentModel.belongsTo(FiscalSetupModel, {
	foreignKey: 'yearId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FiscalSetupModel table
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});


module.exports = leaveEnchasmentModel;
