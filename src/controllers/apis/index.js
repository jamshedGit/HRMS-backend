module.exports.authController = require("../apis/auth.controller");
module.exports.roleController = require("../apis/settings/role.controller");
module.exports.resourceController = require("../apis/settings/resource.controller");
module.exports.accessRightController = require("../apis/settings/accessRight.controller");
module.exports.settingController = require('../apis/settings/setting.controller');
module.exports.userController = require("../apis/user.controller");
module.exports.employeeFormProfile = require('./operations/emp_profile/profile.controller')
module.exports.employeeSalaryRevision = require('./operations/employee_salary_revision/employee_salary_revision.controller')
module.exports.payrollMonthSetup = require('./operations/payroll_month_setup/payroll_month_setup.controller')
module.exports.finalSetllementPolicy = require('./operations/final_settlement_policy/final_settlement_policy.controller')
module.exports.loanTypeSetup = require('./operations/loan_type/loan_type.controller')
module.exports.payrollProcessPolicy = require('./operations/payroll_process_policy/payroll_process_policy.controller')
module.exports.leaveManagementConfiguration = require('./operations/leave_management_configuration/leave_management_configuration.controller')
module.exports.leaveApplication = require('./operations/leave_application/leave_application.controller')




