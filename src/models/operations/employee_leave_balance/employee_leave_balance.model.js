const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, FiscalSetupModel } = require('../..');

const employeeLeaveBalanceModel = sequelize.define('t_employee_leave_balance', {
    Id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: Sequelize.INTEGER, allowNull: false },
    leaveType: { type: Sequelize.INTEGER, allowNull: false },
    yearId: { type: Sequelize.INTEGER, allowNull: false },
    allocatedCount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('allocatedCount');
            return typeof rawValue != 'undefined' ? Number(rawValue) : null;
        }
    },
    availedCount: {
        type: Sequelize.FLOAT, allowNull: true,
        get() {
            const rawValue = this.getDataValue('availedCount');
            return typeof rawValue != 'undefined' ? Number(rawValue) : null;
        }
    },
    remainingCount: {
        type: Sequelize.FLOAT, allowNull: true,
        get() {
            const rawValue = this.getDataValue('remainingCount');
            return typeof rawValue != 'undefined' ? Number(rawValue) : null;
        }
    },
    carryForwardCount: {
        type: Sequelize.FLOAT, allowNull: true,
        get() {
            const rawValue = this.getDataValue('carryForwardCount');
            return typeof rawValue != 'undefined' ? Number(rawValue) : null;
        }
    },
    lateCount: {
        type: Sequelize.FLOAT, allowNull: true,
        get() {
            const rawValue = this.getDataValue('lateCount');
            return typeof rawValue != 'undefined' ? Number(rawValue) : null;
        }
    },
    encashmentCount: {
        type: Sequelize.FLOAT, allowNull: true,
        get() {
            const rawValue = this.getDataValue('encashmentCount');
            return typeof rawValue != 'undefined' ? Number(rawValue) : null;
        }
    },
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
    onUpdate: 'CASCADE',
});

// Association with LeaveTypeModel model (employeeId is a foreign key)
employeeLeaveBalanceModel.belongsTo(LeaveTypeModel, {
    foreignKey: 'leaveType',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

// Association with FiscalSetupModel model (yearId is a foreign key)
employeeLeaveBalanceModel.belongsTo(FiscalSetupModel, {
    foreignKey: 'yearId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in FiscalSetupModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});


module.exports = employeeLeaveBalanceModel;
