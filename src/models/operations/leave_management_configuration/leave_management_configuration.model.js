const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, FormModel } = require('../..');

// Define the User model
class LeaveManagementConfigurationModel extends Model {
}

// Initialize the model
LeaveManagementConfigurationModel.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subsidiaryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    employeeTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weekend: {
      type: DataTypes.JSON,
      allowNull: true
    },
    isSandwich: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 't_leave_management_configuration',
  }
);

// Association with EmployeeProfileModel model (subsidiaryId is a foreign key)
LeaveManagementConfigurationModel.belongsTo(FormModel, {
  foreignKey: 'subsidiaryId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
  as: 'subsidiary'
});

// Association with FormModel model (subsidiaryId is a foreign key)
LeaveManagementConfigurationModel.belongsTo(FormModel, {
  foreignKey: 'employeeTypeId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
  as: 'employeeType'
});

// Association with FormModel model (subsidiaryId is a foreign key)
LeaveManagementConfigurationModel.belongsTo(FormModel, {
  foreignKey: 'gradeId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
  as: 'grade'
});


module.exports = LeaveManagementConfigurationModel;
