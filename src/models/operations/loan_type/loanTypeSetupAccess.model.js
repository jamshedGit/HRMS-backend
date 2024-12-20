const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { SubsidiaryModel, LoanTypeModel } = require('../..');

// Define the User model
class LoanTypeSetupAccess extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
LoanTypeSetupAccess.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    loanTypeSetupId: {
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
    modelName: 't_loan_type_setup_access',
    indexes: [
      {
        name: 'loan_typeSetupId_subsidiary_id',
        unique: true,
        fields: ['loan_typeSetupId', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
  }
);

// Association with loan_typeSetupModel model (employeeId is a foreign key)
LoanTypeModel.hasMany(LoanTypeSetupAccess, { foreignKey: 'loan_typeSetupId' });
LoanTypeSetupAccess.belongsTo(LoanTypeModel, {
    foreignKey: 'loan_typeSetupId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in loan_typeSetupModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(LoanTypeSetupAccess, { foreignKey: 'subsidiaryId' });
LoanTypeSetupAccess.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = LoanTypeSetupAccess;