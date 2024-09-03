const Sequelize = require('sequelize');
// const { ResourceModel, BranchModel, DeptModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { DeptModel } = require('../..');

const department = sequelize.define('T_Department', {
    deptId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    deptName: { type: Sequelize.STRING, allowNull: true },
    deptCode: { type: Sequelize.STRING, allowNull: true },
    budgetStrength: { type: Sequelize.STRING, allowNull: true },
    subsidiary: { type: Sequelize.INTEGER, allowNull: true },
    parentDept: { type: Sequelize.INTEGER, allowNull: true },
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

// department.belongsTo(DeptModel, {
//     as: 'dept',
//     foreignKey: 'parentDept',
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE',
// });

// Define associations
// department.belongsTo(DeptModel, { as: 'parentDepartment', foreignKey: 'parentDept' });

// department.hasMany(DeptModel, { as: 'subDepartments', foreignKey: 'parentDeptId' });
// department.belongsTo(DeptModel, { as: 'parentDept', foreignKey: 'parentDept' });


module.exports = department;