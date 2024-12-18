const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const Att_Model = require('../attendance_configuration/attendance_configuration.model');
const { SubsidiaryModel, LeaveTypeModel } = require('../..');

// Define the User model
class LeaveTypeAccess extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
LeaveTypeAccess.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    leaveTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subsidiaryId: {
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
    modelName: 't_leave_type_access',
    indexes: [
      {
        name: 'leaveTypeId_subsidiary_id',
        unique: true,
        fields: ['leaveTypeId', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
  }
);

// Association with LeaveTypeModel model (employeeId is a foreign key)
LeaveTypeModel.hasMany(LeaveTypeAccess, { foreignKey: 'leaveTypeId' });
LeaveTypeAccess.belongsTo(LeaveTypeModel, {
	foreignKey: 'leaveTypeId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(LeaveTypeAccess, { foreignKey: 'subsidiaryId' });
LeaveTypeAccess.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});

module.exports = LeaveTypeAccess;