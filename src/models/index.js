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

//Bank Model
module.exports.BankModel = require('./operations/banks/bank.model');
//Exit Model
module.exports.exitModel = require('./operations/exit/exit.model');

//Salarypolicy Model
module.exports.salarypolicyModel = require('./operations/salarypolicy/salarypolicy.model');
//Bank Model
module.exports.BranchModel = require('./operations/branch/branch.model');
//Department Model
module.exports.DeptModel = require('./operations/department/dept.model');
//Religion Model
module.exports.ReligionModel = require('./operations/religion/religion.model');

//Employee Type Model
module.exports.EmployeeTypeModel = require('./operations/employeeType/employeeType.model');

//Employee Type Model
module.exports.RegionModel = require('./operations/region/region.model');

//Desingation Type Model
module.exports.DesignationModel = require('./operations/designation/designation.model');

//Desingation Type Model
module.exports.FormModel = require('./operations/form/form.model');

//EmployeePolicyModel
module.exports.EmployeePolicyModel = require('./operations/emppolicy/emppolicy.model');
module.exports.ArrearPolicyModel = require('./operations/arrear_policy/arrear_policy.model');
module.exports.RoundingPolicyModel = require('./operations/salary_rounding_policy/salary_rounding_policy.model');

//EMployee Profile
module.exports.EmployeeProfileModel = require('./operations/emp_profile/emp_profile.model');

//Contact 
module.exports.ContactInformationModel = require('./operations/emp_profile/emp_contact.model');

//Contact 
module.exports.AcademicModel = require('./operations/academic/academic.model');

//Contact 
module.exports.ExperienceModel = require('./operations/experience/experience.model');

//Contact 
module.exports.SkillsModel = require('./operations/skills/skills.model');

//Contact 
module.exports.IncidentModel = require('./operations/incident/incident.model');

//EarningModel 
module.exports.EarningModel = require('./operations/earning/earning.model');

//deduction 
module.exports.DeductionModel = require('./operations/deduction/deduction.model');

//stoppage_allowance 
module.exports.StoppageAllonceModel = require('./operations/stoppage_allowance/stoppage_allowance.model');

//ExchangeRate 
module.exports.ExchangeRateModel = require('./operations/exchange_rate/exchange_rate.model');

//ExchangeRate 
module.exports.CompensationBenefitsModel = require('./operations/compensatio_benefits/compensation_benefits.model');

//EarningDeductionTranModel 
module.exports.EarningDeductionTranModel = require('./operations/earning_transaction/earning_transaction.model');

//EarningDeductionTranModel 
module.exports.EmployeeSalaryEarningModel = require('./operations/employee_salary_earning/employee_salary_earning.model');

//EarningDeductionTranModel 
module.exports.EmployeeSalaryModel = require('./operations/employee_salary_setup/employee_salary_setup.model');

//EmployeeSalaryExpatriateModel 
module.exports.EmployeeSalaryExpatriateModel = require('./operations/employee_salary_expatriate/employee_salary_expatriate.model');

//EarningDeductionTranModel 
module.exports.CompensationExpatriateModel = require('./operations/compensation_expatriate_policy/compensation_expatriate_policy.model');

//EmployeeTransferModel 
module.exports.EmployeeTransferModel = require('./operations/employee_transfer/employee_transfer.model');

//EmployeeSalaryRevisionModel 
module.exports.EmployeeSalaryRevisionModel = require('./operations/employee_salary_revision/employee_salary_revision.model');

//Tax Setup 
module.exports.TaxSetupModel = require('./operations/tax_setup/tax_setup.model');

//Fiscal Setup 
module.exports.FiscalSetupModel = require('./operations/fiscal_setup/fiscal_setup.model');

//PayrollMonthModel Setup 
module.exports.PayrollMonthModel = require('./operations/payroll_month_setup/payroll_month_setup.model');

//Model for Leave Type
module.exports.LeaveTypeModel = require('./operations/leave_type/leave_type.model');

//PayrollMonthModel Setup 
module.exports.FinalSettlementModel = require('./operations/final_settlement_policy/final_settlement_policy.model');

//Salarypolicy Model
module.exports.salarypolicyModel = require('./operations/salarypolicy/salarypolicy.model');

//OneTimeAllowance Model
module.exports.OneTimeAllowance = require('./operations/onetime_allowance/onetime_allowance.model');


//LoanTypeModel Model
module.exports.LoanTypeModel = require('./operations/loan_type/loan_type.model');




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
