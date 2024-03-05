// User Management
// module.exports.TokenModel1 = require('./token.model');
// module.exports.UserModel1 = require('./user.model');
// module.exports.RoleaccessModel1 = require('./settings/roleaccess.model');
// module.exports.ResourceModel1 = require('./settings/resource1.model');



module.exports.RoleModel = require('./settings/role.model');
module.exports.AccessModel = require('./settings/access.model');
module.exports.ResourceModel = require('./settings/resource.model');
module.exports.AccessRightModel = require('./settings/accessRight.model');



//Operations' models initialization 
module.exports.IncidentTypeModel = require('./operations/transactions/incidentType.model')
module.exports.CountryModel = require('./operations/entities/countries.model');
module.exports.CityModel = require('./operations/entities/cities.model');
module.exports.CenterModel = require('./operations/entities/centers.model');
module.exports.SubCenterModel = require('./operations/entities/subcenters.model');
module.exports.IncidentSeverityModel = require('./operations/transactions/incidentSeverity.model')
module.exports.ItemModel = require('./operations/entities/items.model');

//Dontation Receipt Model
module.exports.DonationReceiptModel = require('./operations/edrs/donationReceipt.model');

module.exports.UnitTypeModel = require('./operations/entities/unitsType.model');
module.exports.StatusTypeModel = require('./operations/entities/status.model');
module.exports.VehicleCategoryModel = require('./operations/vehicles/vehicleCategory.model');
// Setups
module.exports.UserModel = require('./user.model');
module.exports.TokenModel = require('./token.model');


module.exports.VehicleDetailModel = require('./operations/vehicles/vehicleDetails.model');
module.exports.IncidentDetailModel = require('./operations/transactions/incidentDetails.model');

// Accounts' models initialization 
module.exports.AlarmTimeModel = require('./operations/entities/alarmtime.model');
module.exports.DriverTripLogModel = require('./operations/transactions/driverTripLog.model');
module.exports.ExpenseCategoryModel = require('./accounts/incomeExpenses/expensesCategories.model');
module.exports.DriverRouteModel = require('./operations/transactions/driverRoutes.model');
module.exports.TransactionMasterModel = require('./accounts/transactions/transactionsMaster.model');
module.exports.TransactionDetailModel = require('./accounts/transactions/transactionsDetail.model');


// Ibs' models initialization 
module.exports.HospitalModel = require('./operations/ibs/hostpital.model');
module.exports.PoliceStationModel = require('./operations/ibs/policeStation.model');
module.exports.IbFormModel = require('./operations/ibs/ibForm.model');
module.exports.IbsImageModel = require('./operations/ibs/ibfImage.model');
module.exports.MortuaryFormModel = require('./operations/ibs/morturayForm.model');
module.exports.MortuaryImageModel = require('./operations/ibs/mortuaryImages.model');
module.exports.CoffinFormModel = require('./operations/ibs/coffin.model');

// **********New way to Export Models******************

// const RoleModel = require('./settings/role.model');
// const AccessModel = require('./settings/access.model');
// const ResourceModel = require('./settings/resource.model');
// const AccessRightModel = require('./settings/accessRight.model');



// // //Operations' models initialization 
// const IncidentTypeModel = require('./operations/transactions/incidentType.model')
// const CountryModel = require('./operations/entities/countries.model');
// const CityModel = require('./operations/entities/cities.model');
// const CenterModel = require('./operations/entities/centers.model');
// const SubCenterModel = require('./operations/entities/subcenters.model');
// const IncidentSeverityModel = require('./operations/transactions/incidentSeverity.model')
// const ItemModel = require('./operations/entities/items.model');
// const UnitTypeModel = require('./operations/entities/unitsType.model');
// const StatusTypeModel = require('./operations/entities/status.model');
// const VehicleCategoryModel = require('./operations/vehicles/vehicleCategory.model');
// // // Setups
// const UserModel = require('./user.model');
// const TokenModel = require('./token.model');


// const IncidentDetailModel = require('./operations/transactions/incidentDetails.model');

// // Accounts' models initialization 
// const DriverTripLogModel = require('./operations/transactions/driverTripLog.model');
// const ExpenseCategoryModel = require('./accounts/incomeExpenses/expensesCategories.model');
// const DriverRouteModel = require('./operations/transactions/driverRoutes.model');
// const TransactionMasterModel = require('./accounts/transactions/transactionsMaster.model');
// const TransactionDetailModel = require('./accounts/transactions/transactionsDetail.model');
// const VehicleDetailModel = require('./operations/vehicles/vehicleDetails.model');


// module.exports = {
// RoleModel,
// AccessModel,
// ResourceModel,
// IncidentTypeModel,
// CountryModel,
// CityModel,
// CenterModel,
// SubCenterModel,
// IncidentSeverityModel,
// ItemModel,
// UnitTypeModel,
// StatusTypeModel,
// VehicleCategoryModel,
// UserModel,
// TokenModel,
// IncidentDetailModel,
// DriverTripLogModel,
// ExpenseCategoryModel,
// DriverRouteModel,
// TransactionMasterModel,
// TransactionDetailModel,
// VehicleDetailMode,
// AccessRightModel
// }
