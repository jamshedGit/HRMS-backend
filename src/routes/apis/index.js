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
