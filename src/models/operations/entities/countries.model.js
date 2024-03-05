const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");

const countries = sequelize.define("T_COUNTRIES", {
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

module.exports = countries;
