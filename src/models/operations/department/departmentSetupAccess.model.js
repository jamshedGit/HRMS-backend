const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { SubsidiaryModel, DeptModel } = require('../..');

// Define the User model
class DepartmentSetupAccess extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
DepartmentSetupAccess.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    DepartmentSetupId: {
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
    modelName: 't_department_setup_access',
    indexes: [
      {
        name: 'DepartmentSetupId_subsidiary_id',
        unique: true,
        fields: ['DepartmentSetupId', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
  }
);

// Association with DepartmentSetupModel model (employeeId is a foreign key)
DeptModel.hasMany(DepartmentSetupAccess, { foreignKey: 'DepartmentSetupId' });
DepartmentSetupAccess.belongsTo(DeptModel, {
    foreignKey: 'DepartmentSetupId',
    targetKey: 'deptId',  // Assuming 'Id' is the primary key in DepartmentSetupModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(DepartmentSetupAccess, { foreignKey: 'subsidiaryId' });
DepartmentSetupAccess.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = DepartmentSetupAccess;