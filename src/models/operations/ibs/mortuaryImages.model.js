const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const MortuaryFormModel = require('./morturayForm.model');
const mortuaryImage = sequelize.define("T_MORTUARY_IMAGES", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: true },
    url: { type: Sequelize.TEXT('long'), allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

mortuaryImage.belongsTo(MortuaryFormModel, {
    as: 'mortuaryForm',
    foreignKey: 'mfId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

MortuaryFormModel.hasMany(mortuaryImage, { 
    as: 'mortuaryFormImages', 
    foreignKey: 'mfId' 
});

module.exports = mortuaryImage;
