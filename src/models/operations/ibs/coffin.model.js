const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const { CountryModel, CityModel, IbFormModel, StatusTypeModel, MortuaryFormModel } = require('../../../models');
const coffinForm = sequelize.define("T_COFFIN_FORMS", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    SN: { type: Sequelize.INTEGER, allowNull: true },
    dateTime: { type: Sequelize.DATE, allowNull: true },
    fullNameOfTheDeceased: { type: Sequelize.STRING, allowNull: true },
    fatherNameOfTheDeceased: { type: Sequelize.STRING, allowNull: true },
    surname: { type: Sequelize.STRING, allowNull: true },
    cast: { type: Sequelize.STRING, allowNull: true },
    religion: { type: Sequelize.STRING, allowNull: true },
    nativePlace: { type: Sequelize.STRING, allowNull: true },
    age: { type: Sequelize.INTEGER, allowNull: true },
    gender: { type: Sequelize.STRING, allowNull: true },
    dateTimeofDeath: { type: Sequelize.DATE, allowNull: true },
    causeOfDeath: { type: Sequelize.STRING, allowNull: true },
    placeOfDeath: { type: Sequelize.STRING, allowNull: true },
    description: { type: Sequelize.STRING, allowNull: true },
    reporterCnic: { type: Sequelize.STRING, allowNull: true },
    reporterName: { type: Sequelize.STRING, allowNull: true },
    reporterPhNo: { type: Sequelize.STRING, allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

coffinForm.belongsTo(CountryModel, {
    as: 'country',
    foreignKey: 'countryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

coffinForm.belongsTo(CityModel, {
    as: 'city',
    foreignKey: 'cityId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});


coffinForm.belongsTo(IbFormModel, {
    as: 'ibForm',
    foreignKey: 'ibfId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

coffinForm.belongsTo(MortuaryFormModel, {
    as: 'mortuaryForm',
    foreignKey: 'mfId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

coffinForm.belongsTo(StatusTypeModel, {
    as: 'status',
    foreignKey: 'statusId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});


IbFormModel.hasOne(coffinForm, { as: 'coffinFormRelatedToIbForm', foreignKey: 'ibfId' });
MortuaryFormModel.hasOne(coffinForm, { as: 'coffinFormRelatedToMortuaryForm', foreignKey: 'mfId' });

module.exports = coffinForm;
