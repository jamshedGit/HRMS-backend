const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const { CountryModel, CityModel, HospitalModel, StatusTypeModel, IbFormModel } = require('../../../models');
const mortuaryForm = sequelize.define("T_MORTUARY_FORMS", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sN: { type: Sequelize.INTEGER, allowNull: true },
    dateTime: { type: Sequelize.DATE, allowNull: true },
    fullNameOfTheDeceased: { type: Sequelize.STRING, allowNull: true },
    fatherNameOfTheDeceased: { type: Sequelize.STRING, allowNull: true },
    Address: { type: Sequelize.STRING, allowNull: true },
    mortuaryReachdateTime: { type: Sequelize.DATE, allowNull: true },
    description: { type: Sequelize.STRING, allowNull: true },
    callerCnic: { type: Sequelize.STRING, allowNull: true },
    callerName: { type: Sequelize.STRING, allowNull: true },
    callerPhNo: { type: Sequelize.STRING, allowNull: true },
    dischargeFromMortuaryDateTime: { type: Sequelize.DATE, allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

mortuaryForm.belongsTo(IbFormModel, {
    as: 'ibForm',
    foreignKey: 'ibfId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

mortuaryForm.belongsTo(CountryModel, {
    as: 'country',
    foreignKey: 'countryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

mortuaryForm.belongsTo(CityModel, {
    as: 'city',
    foreignKey: 'cityId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

mortuaryForm.belongsTo(HospitalModel, {
    as: 'hospital',
    foreignKey: 'hospitalId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

mortuaryForm.belongsTo(StatusTypeModel, {
    as: 'status',
    foreignKey: 'statusId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

IbFormModel.hasOne(mortuaryForm, { as: 'relatedMortuaryForm', foreignKey: 'ibfId' });

module.exports = mortuaryForm;
