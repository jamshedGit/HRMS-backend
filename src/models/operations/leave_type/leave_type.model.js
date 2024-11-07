const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const Att_Model = require('../attendance_configuration/attendance_configuration.model');

// Define the User model
class LeaveTypeModel extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
LeaveTypeModel.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subsidiaryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    companyId: {
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
    modelName: 't_leave_type',
  }
);

Att_Model.belongsTo(LeaveTypeModel, {
	foreignKey: 'leave_typeId',
  as: "leavetype",
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});



module.exports = LeaveTypeModel;