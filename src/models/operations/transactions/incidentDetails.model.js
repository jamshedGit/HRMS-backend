const Sequelize = require('sequelize');
const {CenterModel, VehicleDetailModel, UserModel, IncidentTypeModel, IncidentSeverityModel, DriverTripLogModel } = require('../../index');
const sequelize = require('../../../config/db');


const incidentDetails = sequelize.define('T_INCIDENT_DETAILS', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	callerName: { type: Sequelize.STRING(100), allowNull:false },
    callerCNIC: { type: Sequelize.STRING, allowNull:true },
    callerPhoneNo: { type: Sequelize.STRING(20), allowNull:true },
    patientName: {type:Sequelize.STRING(30), allowNull:true},
    patientCNIC: {type:Sequelize.STRING(30), allowNull:true},
    shortDescription: {type:Sequelize.STRING(150), allowNull:true},
    location: {type:Sequelize.STRING(60), allowNull:true},
    area:{type:Sequelize.STRING, allowNull:true},
	slug: { type: Sequelize.STRING, allowNull:true },
	status: { type: Sequelize.STRING, allowNull:false, defaultValue: 'Open' },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue:true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true}
});

// incidentDetails.belongsTo(UserModel,{
//     foreignKey:'driverId',
//     onDelete:'CASCADE',
//     onUpdate:'CASCADE',
// });



incidentDetails.belongsTo(IncidentTypeModel, {
    as: 'incidentType',
    foreignKey: 'incidentTypeId',
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})


incidentDetails.belongsTo(IncidentSeverityModel, {
    as: "incidentSeverity",
    foreignKey: "incidentSeverityId",
    onDelete: "CASCADE",
    onUpdate:"CASCADE"
})

// incidentDetails.belongsTo(DriverTripLogModel, {
//     as: "triplog"
// })

// incidentDetails.belongsTo(CenterModel,{
//     as: 'center',
//     foreignKey:'centerId',
//     onDelete:'CASCADE',
//     onUpdate:'CASCADE',
// });

// incidentDetails.belongsTo(VehicleDetailModel,{
//     as: 'vehicle',
//     foreignKey:'vehicleId',
//     onDelete:'CASCADE',
//     onUpdate:'CASCADE',
// });

module.exports = incidentDetails;