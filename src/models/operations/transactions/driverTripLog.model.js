const Sequelize = require('sequelize')
const { IncidentDetailModel, VehicleDetailModel, CenterModel, UserModel, SubCenterModel, AlarmTimeModel } = require('../../index');
const sequelize = require('../../../config/db')

const driverTriplog = sequelize.define('T_DRIVER_TRIPLOG', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
    startDateTime: {type: Sequelize.DATE, allowNull: true},
    endDateTime: {type: Sequelize.DATE, allowNull: true},
    initialReading: { type: Sequelize.INTEGER, allowNull: true},
    finalReading: { type: Sequelize.INTEGER, allowNull: true},
    kiloMeters: { type: Sequelize.INTEGER, allowNull: true},
    price: { type: Sequelize.INTEGER, allowNull: true},
    logBookNo: { type: Sequelize.INTEGER, allowNull: true},
    status: {type: Sequelize.STRING},
    dateTime: {type: Sequelize.DATE},
    isActive: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: true},
    createdBy:{ type:Sequelize.INTEGER, allowNull:true,},
    updatedBy:{ type:Sequelize.INTEGER,allowNull:true,},
	// Timestamps
	createdAt:{ type: Sequelize.DATE },
	updatedAt: {type: Sequelize.DATE}
    })

driverTriplog.belongsTo(AlarmTimeModel, {
    as: "alarmtime",
    foreignKey: 'alarmTimeId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

driverTriplog.belongsTo(CenterModel,{
    as: "sourcecenter",
    foreignKey:'sourceCenterId',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
});

driverTriplog.belongsTo(SubCenterModel,{
    as: 'sourcesubcenter',
    foreignKey:'sourceSubCenterId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

driverTriplog.belongsTo(CenterModel, {
    as: "destinationcenter",
    foreignKey: 'destinationCenterId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

driverTriplog.belongsTo(SubCenterModel, {
    as: 'destinationsubcenter',
    foreignKey: 'destinationSubCenterId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

driverTriplog.belongsTo(VehicleDetailModel, {
    foreignKey: 'vehicleId',
    as: "vehicle",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

driverTriplog.belongsTo(IncidentDetailModel, {
    foreignKey: 'incidentId',
    as: "incident",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

driverTriplog.belongsTo(UserModel, {
    as: "driver",
    foreignKey: "driverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

module.exports = driverTriplog;