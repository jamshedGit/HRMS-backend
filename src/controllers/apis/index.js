module.exports.authController = require("../apis/auth.controller");
module.exports.roleController = require("../apis/settings/role.controller");
module.exports.resourceController = require("../apis/settings/resource.controller");
module.exports.accessRightController = require("../apis/settings/accessRight.controller");
module.exports.settingController = require('../apis/settings/setting.controller');
module.exports.userController = require("../apis/user.controller");
module.exports.centerController = require("../apis/operations/entities/center.controller");
module.exports.subCenterController = require("../apis/operations/entities/subcenter.controller");
module.exports.itemController = require("../apis/operations/entities/item.controller")
module.exports.incidentDetailController = require('../apis/operations/transactions/incidentDetail.controller')
module.exports.driverRouteController = require('../apis/operations/transactions/incidentDetail.controller')
module.exports.driverTriplogController = require('../apis/operations/transactions/driverTriplog.controller')
module.exports.vehicleCategoryController = require('./operations/vehicles/vehicleCategory.controller')
module.exports.vehicleDetailController = require('./operations/vehicles/vehicleDetail.controller')
module.exports.expenseCategoryController = require('./accounts/incomeExpenses/expenseCategory.controller')
module.exports.transactionMasterController = require('./accounts/transactions/transactionMaster.controller')
module.exports.transactionDetailController = require('./accounts/transactions/transactionDetail.controller')
module.exports.incidentTypeController = require('./operations/transactions/incidentType.controller')
module.exports.incidentSeverityController = require('./operations/transactions/incidentSeverity.controller')
module.exports.ibFormController = require('./operations/ibs/ibForm.controller')
module.exports.mortuaryFormController = require('./operations/ibs/mortuaryForm.controller')
module.exports.coffinFormController = require('./operations/ibs/coffinForm.controller')
module.exports.employeeFormProfile = require('./operations/emp_profile/profile.controller')
module.exports.employeeSalaryRevision = require('./operations/employee_salary_revision/employee_salary_revision.controller')
module.exports.payrollMonthSetup = require('./operations/payroll_month_setup/payroll_month_setup.controller')
module.exports.finalSetllementPolicy = require('./operations/final_settlement_policy/final_settlement_policy.controller')
module.exports.loanTypeSetup = require('./operations/loan_type/loan_type.controller')
module.exports.payrollProcessPolicy = require('./operations/payroll_process_policy/payroll_process_policy.controller')
module.exports.leaveManagementConfiguration = require('./operations/leave_management_configuration/leave_management_configuration.controller')




