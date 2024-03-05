const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const {CountryModel, CityModel } = require('../../../models');


const hospital = sequelize.define("T_HOSPITALS", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: true },
    address: { type: Sequelize.STRING, allowNull: true },
    phNo: { type: Sequelize.STRING, allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

hospital.belongsTo(CountryModel, {
    as: 'country',
    foreignKey: 'countryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

hospital.belongsTo(CityModel, {
    as: 'city',
    foreignKey: 'cityId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = hospital;
