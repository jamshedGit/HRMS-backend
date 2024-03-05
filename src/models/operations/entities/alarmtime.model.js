const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");

const alarmTime = sequelize.define("T_ALARMTIME", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    durationInMinutes: { type: Sequelize.INTEGER, allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

module.exports = alarmTime;
