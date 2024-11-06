const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, FiscalSetupModel } = require('../..');

const employeeLeaveBalanceModel = sequelize.define('t_employee_leave_balance', {
    Id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: Sequelize.INTEGER, allowNull: false },
    leaveType: { type: Sequelize.INTEGER, allowNull: false },
    yearId: { type: Sequelize.INTEGER, allowNull: false },
    allocatedCount: { type: Sequelize.INTEGER, allowNull: true },
    availedCount: { type: Sequelize.INTEGER, allowNull: true },
    remainingCount: { type: Sequelize.INTEGER, allowNull: true },
    carryForwardCount: { type: Sequelize.INTEGER, allowNull: true },
    lateCount: { type: Sequelize.INTEGER, allowNull: true },
    encashmentCount: { type: Sequelize.INTEGER, allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: 1 },
    createdBy: { type: Sequelize.INTEGER, allowNull: true },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

// Association with EmployeeProfileModel model (employeeId is a foreign key)
EmployeeProfileModel.hasMany(employeeLeaveBalanceModel, { foreignKey: 'employeeId' });
employeeLeaveBalanceModel.belongsTo(EmployeeProfileModel, {
    foreignKey: 'employeeId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeProfileModel table
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

// Association with LeaveTypeModel model (employeeId is a foreign key)
employeeLeaveBalanceModel.belongsTo(LeaveTypeModel, {
    foreignKey: 'leaveType',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

// Association with FiscalSetupModel model (yearId is a foreign key)
employeeLeaveBalanceModel.belongsTo(FiscalSetupModel, {
    foreignKey: 'yearId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in FiscalSetupModel table
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});


module.exports = employeeLeaveBalanceModel;
