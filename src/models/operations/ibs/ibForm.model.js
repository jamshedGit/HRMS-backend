const Sequelize = require("sequelize");
const sequelize = require("../../../config/db");
const { CountryModel, CityModel, VehicleDetailModel, IncidentTypeModel, CenterModel, SubCenterModel, PoliceStationModel, HospitalModel, StatusTypeModel } = require('../../../models');
const ibForm = sequelize.define("T_IB_FORMS", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bodyType: { type: Sequelize.STRING, allowNull: true },
    vehicleType: { type: Sequelize.STRING, allowNull: true },
    description: { type: Sequelize.STRING, allowNull: true },
    gender: { type: Sequelize.STRING, allowNull: true },
    age: { type: Sequelize.INTEGER, allowNull: true },
    patientName: { type: Sequelize.STRING, allowNull: true },
    callerCnic: { type: Sequelize.STRING, allowNull: true },
    callerName: { type: Sequelize.STRING, allowNull: true },
    callerPhNo: { type: Sequelize.STRING, allowNull: true },
    dateTime: { type: Sequelize.DATE, allowNull: true },
    incidentlocationReachdateTime: { type: Sequelize.DATE, allowNull: true },
    hospitalReachdateTime: { type: Sequelize.DATE, allowNull: true },
    incidentAddress: { type: Sequelize.STRING, allowNull: true },
    vehicleRegNo: { type: Sequelize.STRING, allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    updatedBy: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});

ibForm.belongsTo(CountryModel, {
    as: 'country',
    foreignKey: 'countryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(CityModel, {
    as: 'city',
    foreignKey: 'cityId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(VehicleDetailModel, {
    as: 'vehicle',
    foreignKey: 'vehicleId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(IncidentTypeModel, {
    as: 'incidentType',
    foreignKey: 'incidentTypeId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(CenterModel, {
    as: 'district',
    foreignKey: 'districtId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(SubCenterModel, {
    as: 'area',
    foreignKey: 'areaId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(PoliceStationModel, {
    as: 'policeStation',
    foreignKey: 'policeStationId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(HospitalModel, {
    as: 'hospital',
    foreignKey: 'hospitalId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

ibForm.belongsTo(StatusTypeModel, {
    as: 'status',
    foreignKey: 'statusId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = ibForm;
