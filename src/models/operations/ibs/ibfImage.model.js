const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const IbFormModel = require('./ibForm.model');

const ibsImage = sequelize.define("T_IBS_IMAGES", {
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

ibsImage.belongsTo(IbFormModel, {
    as: 'ibform',
    foreignKey: 'ibfId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

IbFormModel.hasMany(ibsImage, { as: 'ibFormImages', foreignKey: 'ibfId' });



module.exports = ibsImage;
