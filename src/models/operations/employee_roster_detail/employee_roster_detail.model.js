const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, LeaveApplicationModel, EmployeeRosterModel } = require('../..');

const employeeRosterDetailModel = sequelize.define('t_employee_roster_detail', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rosterId: { type: Sequelize.INTEGER, allowNull: false },
    shiftId: { type: Sequelize.INTEGER, allowNull: false },
    date: { type: Sequelize.DATE, allowNull: false },
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

// Association with EmployeeRosterModel model (rosterId is a foreign key)
EmployeeRosterModel.hasMany(employeeRosterDetailModel, { foreignKey: 'rosterId' });
employeeRosterDetailModel.belongsTo(EmployeeRosterModel, {
    foreignKey: 'rosterId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeRosterModel table
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = employeeRosterDetailModel;
