const Sequelize = require('sequelize');
// const { ResourceModel, BranchModel, DeptModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');

const employeeType = sequelize.define('T_EmployeeType', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeeType: { type: Sequelize.STRING, allowNull: true },
    employeeTypeCode: { type: Sequelize.STRING, allowNull: true },
    
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

},
);


module.exports = employeeType;