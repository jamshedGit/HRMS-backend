const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const { CountryModel, CityModel, VehicleDetailModel } = require('../../../models');


const centers = sequelize.define("t_centers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING(70), allowNull: true },
  phoneNo: { type: Sequelize.STRING(20), allowNull: true },
  location: { type: Sequelize.STRING(50), allowNull: true },
  longitude: { type: Sequelize.STRING(50), allowNull: true },
  latitude: { type: Sequelize.STRING(50), allowNull: true },
  slug: { type: Sequelize.STRING, allowNull: true },
  isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  createdBy: { type: Sequelize.INTEGER, allowNull: false },
  updatedBy: { type: Sequelize.INTEGER, allowNull: true },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: true },
});

centers.belongsTo(CountryModel, {
  as: 'country',
  foreignKey: 'countryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

centers.belongsTo(CityModel, {
  as: 'city',
  foreignKey: 'cityId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


module.exports = centers;
