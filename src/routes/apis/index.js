const express = require("express");
const authRoute = require("./auth.route");
const settingRoute = require("./settings/setting.route");
// const roleRoute = require("./settings/role.route");
// const resourceRoute = require("./settings/resource.route");
// const accessRightRoute = require("./settings/accessRight.route");
const userRoute = require("./user.route");
const centerRoute = require("./operations/entities/centers.route");
// const subCenterRoute = require("./operations/entities/subcenters.route");
const itemRoute = require("./operations/entities/items.route");
const unitTypeRoute = require('./operations/entities/unitType.route')
const incidentDetailRoute = require('./operations/transactions/incidentDetail.route')
const driverRoute = require('./operations/transactions/driverRoute.route')
const driverTriplogRoute = require('./operations/transactions/driverTriplog.route')
const vehicleCategorieRoute = require('./operations/vehicles/vehicleCategory.route')
const vehicleDetailRoute = require('./operations/vehicles/vehicleDetail.route')
const expenseCategoriesRoute = require('./accounts/incomeExpenses/expensesCategories.route')
const transactionMaster = require('./accounts/transactions/transactionMaster.route')
const transactionDetail = require('./accounts/transactions/transactionDetail.route')
const incidentType = require('./operations/transactions/incidentType.route')
const incidentSeverity = require('./operations/transactions/incidentSeverity.route')
const ibs = require('./operations/ibs/ibForm.route')
const receipt = require('./operations/edrs/donation.route')
const docsRoute = require("./docs.route");
const config = require("../../config/config");
const bank = require('./operations/banks/bank.route')
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
const arrear_policy = require('./operations/arrear_policy/arrear_policy.route')
const salary_rounding_policy = require('./operations/salary_rounding_policy/salary_rounding_policy.route')




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
    path: "/centers",
    route: centerRoute,
  },
  // {
  //   path: "/subcenters",
  //   route: subCenterRoute,
  // },
  {
    path: "/items",
    route: itemRoute,
  },
  {
    path: '/unittypes',
    route: unitTypeRoute
  },
  {
    path: '/incidentdetails',
    route: incidentDetailRoute
  },
  {
    path: '/driverroute',
    route: driverRoute
  },
  {
    path: '/drivertriplog',
    route: driverTriplogRoute
  },
  {
    path: '/vehiclecategories',
    route: vehicleCategorieRoute
  },
  {
    path: "/vehicles",
    route: vehicleDetailRoute
  },
  {
    path: "/expensecategories",
    route: expenseCategoriesRoute
  },
  {
    path: "/transactionmasters",
    route: transactionMaster
  },
  {
    path: "/transactiondetails",
    route: transactionDetail
  },
  {
    path: '/incidenttype',
    route: incidentType
  },
  {
    path: "/incidentseverity",
    route: incidentSeverity
  },
  {
    path: "/ibs",
    route: ibs
  },
  {
    path: "/edrs",
    route: receipt

  },
  {
    path: "/bank",
    route: bank

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
    path: "/incident",
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
  }



  

  

  // {
  //   path: "/roles",
  //   route: roleRoute,
  // },
  // {
  //   path: "/resources",
  //   route: resourceRoute,
  // },
  // {
  //   path: "/accessrights",
  //   route: accessRightRoute,
  // }
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
