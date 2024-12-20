const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { SubsidiaryModel, DeductionModel } = require('../..');

// Define the User model
class DeductionSetupAccess extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
DeductionSetupAccess.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    deductionSetupId: {
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
    modelName: 't_deduction_setup_access',
    indexes: [
      {
        name: 'deductionSetupId_subsidiary_id',
        unique: true,
        fields: ['deductionSetupId', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
  }
);

// Association with deductionSetupModel model (employeeId is a foreign key)
DeductionModel.hasMany(DeductionSetupAccess, { foreignKey: 'deductionSetupId' });
DeductionSetupAccess.belongsTo(DeductionModel, {
    foreignKey: 'deductionSetupId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in deductionSetupModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(DeductionSetupAccess, { foreignKey: 'subsidiaryId' });
DeductionSetupAccess.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = DeductionSetupAccess;