const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { SubsidiaryModel, CompanyModel, FiscalSetupModel, LeaveTypeModel, FormModel } = require('../..');

const allocateLeavesModel = sequelize.define('t_allocate_leaves', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	cycleTypeId: { type: Sequelize.INTEGER, allowNull: true },
	yearId: { type: Sequelize.INTEGER, allowNull: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true },
	leaveType: { type: Sequelize.INTEGER, allowNull: true },
	leaveCount: { type: Sequelize.INTEGER, allowNull: true },
	policyType: { type: Sequelize.INTEGER, allowNull: true },
	maxCount: { type: Sequelize.INTEGER, allowNull: true },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: 1 },
	createdBy: { type: Sequelize.INTEGER, allowNull: true },
	updatedBy: { type: Sequelize.INTEGER, allowNull: true },
	createdAt: { type: Sequelize.DATE, allowNull: true },
	updatedAt: { type: Sequelize.DATE, allowNull: true },
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(allocateLeavesModel, { foreignKey: 'subsidiaryId' });
allocateLeavesModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});

// Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(allocateLeavesModel, { foreignKey: 'companyId' });
allocateLeavesModel.belongsTo(CompanyModel, {
	foreignKey: 'companyId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});

// Association with FiscalSetupModel model (yearId is a foreign key)
allocateLeavesModel.belongsTo(FiscalSetupModel, {
	foreignKey: 'yearId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FiscalSetupModel table
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});

// Association with LeaveTypeModel model (employeeId is a foreign key)
allocateLeavesModel.belongsTo(LeaveTypeModel, {
	foreignKey: 'leaveType',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});

// Association with FormModel model (allocationType is a foreign key)
allocateLeavesModel.belongsTo(FormModel, {
	foreignKey: 'policyType',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
	as: 'policy',
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});

// Association with FormModel model (cycleTypeId is a foreign key)
allocateLeavesModel.belongsTo(FormModel, {
	foreignKey: 'cycleTypeId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
	as: 'cycleType',
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT',
});


module.exports = allocateLeavesModel;
