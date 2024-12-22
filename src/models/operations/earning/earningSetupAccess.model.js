const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { SubsidiaryModel, EarningModel } = require('../..');

// Define the User model
class EarningSetupAccess extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
EarningSetupAccess.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    earningSetupId: {
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
    modelName: 't_earning_setup_access',
    indexes: [
      {
        name: 'earningSetupId_subsidiary_id',
        unique: true,
        fields: ['earningSetupId', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
  }
);

// Association with earningSetupModel model (employeeId is a foreign key)
EarningModel.hasMany(EarningSetupAccess, { foreignKey: 'earningSetupId' });
EarningSetupAccess.belongsTo(EarningModel, {
    foreignKey: 'earningSetupId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in earningSetupModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(EarningSetupAccess, { foreignKey: 'subsidiaryId' });
EarningSetupAccess.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = EarningSetupAccess;