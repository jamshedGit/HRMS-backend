const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const Att_Model = require('../attendance_configuration/attendance_configuration.model');
const { SubsidiaryModel } = require('../..');

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
    subsidiaryId: {
      type: DataTypes.JSON,
      allowNull: true,
      set(value) {
        this.setDataValue('subsidiaryId', value.map((v) => Number(v)));
      },
      get() {
        const storedValue = this.getDataValue('subsidiaryId');
        if (storedValue && typeof storedValue == 'string') {
          return JSON.parse(storedValue).map((v) => String(v));
        }
        return storedValue;
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
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
    indexes: [
      {
        name: 'code_subsidiary_id',
        unique: true,
        fields: ['code', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
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