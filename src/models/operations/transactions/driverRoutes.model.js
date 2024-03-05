const Sequelize = require('sequelize');
const {VehicleDetailModel,UserModel,IncidentDetailModel } = require('../../index');
const sequelize = require('../../../config/db');

const driverRoutes = sequelize.define('T_DRIVER_ROUTES', {
	id:{ type:Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
	source: { type:Sequelize.STRING(70), allowNull:true },
    destination: { type:Sequelize.STRING(70), allowNull:true },
    initialReading: { type:Sequelize.STRING(20), allowNull:true },
    finalReading: {type: Sequelize.STRING(20), allowNull:true},
	slug: { type: Sequelize.STRING(15), allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt:{ type:Sequelize.DATE, allowNull:true}
});

/*driverRoutes.associate = (models) => {
    driverRoutes.belongsTo(VehicleModel,{
        foreignKey:'vehicleId',
        onDelete:'RESTRICT',
        onUpdate:'CASCADE',
    });
}*/



driverRoutes.belongsTo(UserModel,{
    foreignKey:'driverId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

driverRoutes.belongsTo(IncidentDetailModel,{
    foreignKey:'incidentId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

driverRoutes.belongsTo(VehicleDetailModel,{
    foreignKey:'vehicleId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});


module.exports = driverRoutes;