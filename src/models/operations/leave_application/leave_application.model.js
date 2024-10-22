const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, CompanyModel, SubsidiaryModel } = require('../..');

const leaveApplicationModel = sequelize.define('t_leave_application', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true },
	employeeId: { type: Sequelize.INTEGER, allowNull: false },
	from: { type: Sequelize.DATE, allowNull: false },
	to: { type: Sequelize.DATE, allowNull: false },
	leaveType: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	days: { type: Sequelize.INTEGER, allowNull: false },
	remarks: { type: Sequelize.STRING, allowNull: true },
	file: { type: Sequelize.STRING, allowNull: true },
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
EmployeeProfileModel.hasMany(leaveApplicationModel, { foreignKey: 'employeeId' });
leaveApplicationModel.belongsTo(EmployeeProfileModel, {
	foreignKey: 'employeeId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeProfileModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with LeaveTypeModel model (employeeId is a foreign key)
leaveApplicationModel.belongsTo(LeaveTypeModel, {
	foreignKey: 'leaveType',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(leaveApplicationModel, { foreignKey: 'subsidiaryId' });
leaveApplicationModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(leaveApplicationModel, { foreignKey: 'subsidiaryId' });
leaveApplicationModel.belongsTo(CompanyModel, {
	foreignKey: 'companyId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});


module.exports = leaveApplicationModel;
