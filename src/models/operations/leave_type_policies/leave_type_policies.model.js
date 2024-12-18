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
      type: DataTypes.FLOAT,
      allowNull: true
    },
    maxAllowed: {
      type: DataTypes.FLOAT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('maxAllowed');
        return typeof rawValue != 'undefined' ? Number(rawValue) : null;
      }
    },
    entitledAt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    encashable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    encashableCount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('encashableCount');
        return typeof rawValue != 'undefined' ? Number(rawValue) : null;
      }
    },
    carryForwardable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    carryForwardableCount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('carryForwardableCount');
        return typeof rawValue != 'undefined' ? Number(rawValue) : null;
      }
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
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Association with FormModel model (gender is a foreign key)
LeaveTypePoliciesModel.belongsTo(FormModel, {
  foreignKey: 'gender',
  targetKey: 'Id', // Assuming 'Id' is the primary key in FormMenu table
  as: 'genderDetail',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Association with FormModel model (maritalStatus is a foreign key)
LeaveTypePoliciesModel.belongsTo(FormModel, {
  foreignKey: 'maritalStatus',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in FormMenu table
  as: 'maritalDetail',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Association with FormModel model (entitledAt is a foreign key)
LeaveTypePoliciesModel.belongsTo(FormModel, {
  foreignKey: 'entitledAt',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in FormMenu table
  as: 'entitleType',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});


LeaveManagementConfigurationModel.hasMany(LeaveTypePoliciesModel, { foreignKey: 'leaveManagementConfigId' });
LeaveTypePoliciesModel.belongsTo(LeaveManagementConfigurationModel, {
  foreignKey: 'leaveManagementConfigId', 
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

module.exports = LeaveTypePoliciesModel;
