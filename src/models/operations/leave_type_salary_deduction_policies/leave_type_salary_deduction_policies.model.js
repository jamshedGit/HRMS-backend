const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { LeaveTypeModel, FormModel, LeaveManagementConfigurationModel } = require('../..');

// Define the User model
class LeaveTypeSalaryDeductionPoliciesModel extends Model {
  // static associate(models) {
  //    // Association with LeaveTypeModel model (leaveType is a foreign key)
  //    this.belongsTo(LeaveTypeModel, {
  //     foreignKey: 'leaveType',
  //     targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
  //   });

  //   // Association with FormModel model (leaveStatus is a foreign key)
  //   this.belongsTo(FormModel, {
  //     foreignKey: 'leaveStatus',
  //     targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
  //   });

  //   // Association with FormModel model (LeaveManagementConfigurationModel is a foreign key)
  //   this.belongsTo(LeaveManagementConfigurationModel, {
  //     foreignKey: 'leaveManagementConfigId',
  //     targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveManagementConfigurationModel table
  //   });

  // }
}

// Initialize the model
LeaveTypeSalaryDeductionPoliciesModel.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    leaveManagementConfigId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    leaveType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    maxLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deduction: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    leaveStatus: {
      type: DataTypes.INTEGER,
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
    modelName: 't_leave_type_salary_deduction_policies',
  }
);

LeaveTypeSalaryDeductionPoliciesModel.belongsTo(LeaveTypeModel, {
  foreignKey: 'leaveType',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
});

// Association with FormModel model (leaveStatus is a foreign key)
LeaveTypeSalaryDeductionPoliciesModel.belongsTo(FormModel, {
  foreignKey: 'leaveStatus',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
});

LeaveManagementConfigurationModel.hasMany(LeaveTypeSalaryDeductionPoliciesModel, { foreignKey: 'leaveManagementConfigId' });
LeaveTypeSalaryDeductionPoliciesModel.belongsTo(LeaveManagementConfigurationModel, { foreignKey: 'Id' });

module.exports = LeaveTypeSalaryDeductionPoliciesModel;
