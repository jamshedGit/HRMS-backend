const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { SubsidiaryModel, User_Model } = require('../..');

// Define the User model
class UserAccess extends Model {
  static associate(models) {
    // define associations here
  }
}

// Initialize the model
UserAccess.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
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
    modelName: 't_user_access',
    indexes: [
      {
        name: 'userId_subsidiary_id',
        unique: true,
        fields: ['userId', 'subsidiaryId'], // Specify the fields for the composite index
      },
    ],
  }
);


User_Model.hasMany(UserAccess, { foreignKey: 'userId' });
UserAccess.belongsTo(User_Model, {
    foreignKey: 'userId',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(UserAccess, { foreignKey: 'subsidiaryId' });
UserAccess.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = UserAccess;