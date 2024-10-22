const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { CompanyModel } = require('../..');
const FormModel = require('../form/form.model');

const SubsidiaryModel = sequelize.define('t_subsidiary', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: { type: Sequelize.STRING(50), allowNull: false },
    currencyId: { type: Sequelize.INTEGER, allowNull: true },
    companyId: { type: Sequelize.INTEGER, allowNull: false },
    isActive: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
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

// Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(SubsidiaryModel, { foreignKey: 'companyId' });
SubsidiaryModel.belongsTo(CompanyModel, {
    foreignKey: 'companyId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// Association with FormModel model (currencyId is a foreign key)
SubsidiaryModel.belongsTo(FormModel, {
    foreignKey: 'currencyId',
    targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
    as: 'currency',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = SubsidiaryModel;