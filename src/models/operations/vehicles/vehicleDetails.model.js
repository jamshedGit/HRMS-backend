const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const sequelize = require('../../../config/db');
const { CenterModel, VehicleCategoryModel, RoleModel, UserModel, SubCenterModel, DriverTripLogModel } = require('../../index');
//VehicleCategoryModel
//CenterModel
const vehicleDetails = sequelize.define('T_VEHICLE_DETAILS', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name: { type: Sequelize.STRING(20), allowNull:true },
    regNo: { type: Sequelize.STRING(20), allowNull:true },
    engineNo: { type: Sequelize.STRING(20), allowNull:true },
    engineCapacity: {type:Sequelize.STRING(20), allowNull:true},
    registerCity: {type:Sequelize.STRING(50), allowNull:true},
    chasis: {type:Sequelize.STRING(30), allowNull:true},
    milleage: {type:Sequelize.STRING(20), allowNull:true},
    year:{type:Sequelize.INTEGER, allowNull:true},
    make:{type:Sequelize.STRING(40), allowNull:true},
    model:{type:Sequelize.STRING(20), allowNull:true},
    color:{type:Sequelize.STRING(20), allowNull:true},
    fuelType: {type:Sequelize.STRING(20), allowNull:true},
    transmission: {type:Sequelize.STRING(25), allowNull:true},
    status: {type: Sequelize.STRING(25), allowNull: true},
	slug: { type: Sequelize.STRING(20), allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true},
});


vehicleDetails.belongsTo(CenterModel,{
    as: 'center',
    foreignKey:'centerId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

vehicleDetails.belongsTo(CenterModel,{
    as: 'tempcenter',
    foreignKey:'tempCenterId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

vehicleDetails.belongsTo(SubCenterModel,{
    as: 'subcenter',
    foreignKey:'subCenterId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

vehicleDetails.belongsTo(SubCenterModel,{
    as: 'tempsubcenter',
    foreignKey:'tempSubCenterId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

vehicleDetails.belongsTo(VehicleCategoryModel,{
    as:"category",
    foreignKey:'vehicleCategoryId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

vehicleDetails.belongsTo(UserModel, {
    as: "driver",
    foreignKey: "driverId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
})

// vehicleDetails.hasMany(DriverTripLogModel, {
//     as: "triplog",
//     foreignKey: "id",
//     onDelete: "RESTRICT",
//     onUpdate: "CASCADE"
// })


vehicleDetails.isRegNoForOldVehicle = (regNo, excludeVehicleId) => vehicleDetails.findOne(
    {
        where: { regNo: regNo, id: { [Op.ne]: excludeVehicleId } }
    }).then((data) => {
        return data;
    });

vehicleDetails.isRegNoForNewVehicle = (regNo) => vehicleDetails.findOne(
    {
        where: { regNo: regNo }
    }).then((data) => {
        return data;
    });

module.exports = vehicleDetails;