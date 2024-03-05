const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const { CountryModel } = require('../../../models/index');

const cities = sequelize.define("T_CITIES", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: Sequelize.STRING(70), allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

cities.belongsTo(CountryModel,{
    as: 'country',
    foreignKey:'countryId',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
});

module.exports = cities;
