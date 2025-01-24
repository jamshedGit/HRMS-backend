const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const CompanyModel = sequelize.define('t_company', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    companyCode:{ type: Sequelize.STRING(6), allowNull: false },
    companyLegalName:{ type: Sequelize.STRING(100), allowNull: true },
    currencyId:{ type: Sequelize.INTEGER, allowNull: false },
    address1: { type: Sequelize.STRING(100), allowNull: true },
    address2: { type: Sequelize.STRING(100), allowNull: true },
    address3: { type: Sequelize.STRING(100), allowNull: true },
    countryId:{ type: Sequelize.INTEGER, allowNull: false },
    cityId:{ type: Sequelize.INTEGER, allowNull: false },
    firstFiscalMonth:{ type: Sequelize.INTEGER, allowNull: false },
    phone:{ type: Sequelize.STRING(15), allowNull: true },
    fax:{ type: Sequelize.STRING(15), allowNull: true },
    email:{ type: Sequelize.STRING(50), allowNull: true },
    web:{ type: Sequelize.STRING(50), allowNull: true },
    EIN:{ type: Sequelize.STRING(20), allowNull: true },
    TIN:{ type: Sequelize.STRING(20), allowNull: true },

    Logo: {
        type: Sequelize.BLOB('medium'),  // 'medium' is used to define the size
        allowNull: false,
      },
    delflag : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
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