const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { LeaveTypeModel, FormModel, LeaveManagementConfigurationModel } = require('../..');

// Define the User model
class LeaveTypePoliciesModel extends Model {
}

// Initialize the model
LeaveTypePoliciesModel.init(
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
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minExp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    maxAllowed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    attachmentRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    maritalStatus: {
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
    modelName: 't_leave_type_policies',
  }
);


// Association with LeaveTypeModel model (leaveType is a foreign key)
LeaveTypePoliciesModel.belongsTo(LeaveTypeModel, {
  foreignKey: 'leaveType',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
});

// Association with FormModel model (gender is a foreign key)
LeaveTypePoliciesModel.belongsTo(FormModel, {
  foreignKey: 'gender',
  targetKey: 'Id', // Assuming 'Id' is the primary key in FormMenu table
  as: 'genderDetail'  
});

// Association with FormModel model (maritalStatus is a foreign key)
LeaveTypePoliciesModel.belongsTo(FormModel, {
  foreignKey: 'maritalStatus',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in FormMenu table
  as: 'maritalDetail'
});


LeaveManagementConfigurationModel.hasMany(LeaveTypePoliciesModel, { foreignKey: 'leaveManagementConfigId' });
LeaveTypePoliciesModel.belongsTo(LeaveManagementConfigurationModel, { foreignKey: 'leaveManagementConfigId' });

module.exports = LeaveTypePoliciesModel;
