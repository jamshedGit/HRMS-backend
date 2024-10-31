const Sequelize = require('sequelize');
// const { ResourceModel, BranchModel, DeptModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const SubsidiaryModel = require('../subsidiary/subsidiary.model');

const department = sequelize.define('t_department', {
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
});

SubsidiaryModel.hasMany(department, { foreignKey: 'subsidiary' });
department.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiary',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

module.exports = department;