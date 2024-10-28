const express = require("express");
const authRoute = require("./auth.route");
const settingRoute = require("./settings/setting.route");
const userRoute = require("./user.route");
const docsRoute = require("./docs.route");
const config = require("../../config/config");
const bank = require('./operations/banks/bank.route')
const exit = require('./operations/exit/exit.route')

const tax_slab = require('./operations/tax_slab/tax_slab.route')
const branch = require('./operations/branch/branch.route')
const department = require('./operations/department/dept.route')
const emptype = require('./operations/employeeType/employeeType.route')
const religion = require('./operations/religion/religion.route')
const region = require('./operations/region/region.route')
const designation = require('./operations/designation/designation.route')
const form = require('./operations/form/form.route')
const formdetails = require('./operations/formdetails/formdetails.route')
const emppolicy = require('./operations/emppolicy/emppolicy.route')
const empprofile = require('./operations/emp_profile/profile.route')
const contact = require('./operations/contact/contact.route')
const academic = require('./operations/academic/academic.route')
const experince = require('./operations/experience/experience.route')
const skills = require('./operations/skills/skills.route')
const incident = require('./operations/incident/incident.route')
const earning = require('./operations/earning/earning.route')
const deduction = require('./operations/deduction/deduction.route')
const stoppage = require('./operations/stoppage_allowance/stoppage_allowance.route')
const exchage_rate = require('./operations/exchange_rate/exchange_rate.route')
const compensation_benefits = require('./operations/compensation_benefits/compensation_benefits.route')
const earning_deduction_transaction = require('./operations/earning_transaction/earning_transaction.route')
const employee_salary_earning = require('./operations/employee_salary_earning/employee_salary_earning.route')
const employee_salary_setup = require('./operations/employee_salary_setup/employee_salary_setup.route')
const salary_expatriate = require('./operations/employee_salary_expatriate/employee_salary_expatriate.route')
const compensation_expatriate = require('./operations/compensation_expatriate_policy/compensation_expatriate_policy.route')
const employee_transfer = require('./operations/employee_transfer/employee_transfer.route')
const salary_revision = require('./operations/employee_salary_revision/employee_salary_revision.route')
const tax_setup = require('./operations/tax_setup/tax_setup.route')
const fiscal_setup = require('./operations/fiscal_setup/fiscal_setup.route')
const payroll_month = require('./operations/payroll_month_setup/payroll_month_setup.route')
const salary_policy = require('./operations/salarypolicy/salarypolicy.route')
const loan_management_configuration = require('./operations/loan_management_configuration/loan_management_configuration')
const arrear_policy = require('./operations/arrear_policy/arrear_policy.route')
const salary_rounding_policy = require('./operations/salary_rounding_policy/salary_rounding_policy.route')
const leave_type = require('./operations/leave_type/leave_type.route')

const final_settlement_policy = require('./operations/final_settlement_policy/final_settlement_policy.route')
const onetime_earning = require('./operations/onetime_allowance/onetime_allowance.route')
const loan_type = require('./operations/loan_type/loan_type.route')
const payroll_process_policy = require('./operations/payroll_process_policy/payroll_process_policy.route')
const leave_management_configuration = require('./operations/leave_management_configuration/leave_management_configuration.route')
const gratuity_configuration = require('./operations/gratuity_configuration/gratuity_configuration.route')

const accrue_gratuity_configuration= require('./operations/accrue_gratuity_configuration/accrue_gratuity_configuration.route')
const reimbursement_configuration=require('./operations/reimbursement_configuration/reimbursement_configuration.route')


const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/settings",
    route: settingRoute,
  },
  
  {
    path: "/bank",
    route: bank

  },
  {
    path: "/exit",
    route: exit

  },


  {
    path: "/tax_slab",
    route: tax_slab

  },
  {
    path: "/branch",
    route: branch

  },
  {
    path: "/department",
    route: department

  },
  {
    path: "/emptype",
    route: emptype

  },
  {
    path: "/religion",
    route: religion

  },
  {
    path: "/region",
    route: region
  },
  {
    path: "/designation",
    route: designation
  },
  {
    path: "/form",
    route: form
  },
  {
    path: "/formdetails",
    route: formdetails
  },
  {
    path: "/policy",
    route: emppolicy
  },
  {
    path: "/profile",
    route: empprofile
  },
  {
    path: "/contact",
    route: contact
  },
  {
    path: "/academic",
    route: academic
  },

  {
    path: "/experience",
    route: experince
  },
  {
    path: "/skills",
    route: skills
  },
  {
    path: "/incident", // hrms-employee-setup
    route: incident
  },
  {
    path: "/earning",
    route: earning
  },
  {
    path: "/deduction",
    route: deduction
  },
  {
    path: "/stoppage",
    route: stoppage
  },
  {
    path: "/exchange",
    route: exchage_rate
  },
  {
    path: "/compensation",
    route: compensation_benefits
  },
  {
    path: "/earning_transaction",
    route: earning_deduction_transaction
  },
  {
    path: "/employee_salary_earning",
    route: employee_salary_earning
  },
  {
    path: "/employee_salary",
    route: employee_salary_setup
  },
  {
    path: "/salary_expatriate",
    route: salary_expatriate
  },
  {
    path: "/compensation_expatriate",
    route: compensation_expatriate
  },
  {
    path: "/employee_transfer",
    route: employee_transfer
  },
  {
    path: "/salary_revision",
    route: salary_revision
  },
  {
    path: "/tax_setup",
    route: tax_setup
  },
  {
    path: "/fiscal_setup",
    route: fiscal_setup
  },
  {
    path: "/payroll_month",
    route: payroll_month
  },
  {
    path: "/arrear_policy",
    route: arrear_policy
  },
  {
    path: "/rounding_policy",
    route: salary_rounding_policy
  },
  {
    path: "/leave_type",
    route: leave_type
  },
  {
    path: "/final_settlement_policy",
    route: final_settlement_policy
  },

  {
    path: "/loan_management_configuration",
    route: loan_management_configuration
  },
  {
    path: "/salary_policy",
    route: salary_policy

  },
  {
    path: "/onetime_earning",
    route: onetime_earning
  },
  {
    path: "/loan_type",
    route: loan_type
  },
  {
    path: "/payroll_process_policy",
    route: payroll_process_policy
  },
  {
    path: "/leave_management_configuration",
    route: leave_management_configuration
  },
  {
    path: "/gratuity_configuration",
    route: gratuity_configuration
  },
  {
    path: "/accrue_gratuity_configuration",
    route: accrue_gratuity_configuration
  },
  {
    path: "/reimbursement_configuration",
    route: reimbursement_configuration
  },


];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];
defaultRoutes.forEach((route) => {
  // console.log("Jamshed", route.path, route.route);
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  // devRoutes.forEach((route) => {
  //   router.use(route.path, route.route);
  // });
}

module.exports = router;
