const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const CompanyModel = sequelize.define('t_company', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: { type: Sequelize.STRING(50), allowNull: false },
    address: { type: Sequelize.STRING(150), allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: 1 },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});



module.exports = CompanyModel;