const express = require("express");
const bodyParser = require('body-parser');
const Sequelize = require("sequelize");
const helmet = require("helmet");
const path = require("path");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const apiRoutes = require("./routes/apis");
// const frontRoutes = require("./routes/front")
// const webRoutes = require("./routes/web_routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const ejs = require("ejs");
const app = express();
// const formidableMiddleware = require("express-formidable");

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// caching disabled for every route
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
// app.use(express.static(path.join(__dirname, "public/admins")));

// parse application/json
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// app.use(
//   ["/apis/create-ibf-images"],
//   formidableMiddleware({
//     keepExtensions: true,
//     uploadDir: "uploads/ibf-images",
//     multiples: true, // req.files to be arrays of files
//   })
// );

app.use("/uploads", express.static("uploads"));

// v1 api routes
app.use("/apis", apiRoutes);
app.use(express.static(path.join(__dirname, "public")));
// app.use("/",frontRoutes);

// Import the sequelize object on which
// we have defined model.
const sequelize = require("./config/db");

// Import the user model we have defined
// const RoleModel = require('./models/setups/role.model')
// const AccessModel = require('./models/setups/access.model')
const {
  HospitalModel,
  PoliceStationModel,
  CityModel,
  CountryModel,
  ResourceModel,
  RoleModel,
  AccessModel,
  AccessRightModel,
  UserModel,
  TokenModel,
  ExpenseCategoryModel,
  TransactionDetailModel,
  TransactionMasterModel,
  CenterModel,
  SubCenterModel,
  ItemModel,
  UnitTypeModel,
  DriverTripLogModel,
  IncidentDetailModel,
  VehicleDetailModel,
  VehicleCategoryModel,
  DriverRouteModel,
  IncidentType,
  IncidentSeverity,
  StatusTypeModel,
  AlarmTimeModel,
  IbFormModel,
  IbsImageModel,
  CoffinFormModel,Loan_management_configurationModel,Loan_management_detailModel
} = require("./models");

// const images = require('./models/operations/ibs/ibfImage.model');
// const ibForm = require('./models/operations/ibs/ibForm.model');


// Loan_management_configurationModel.sync({ true: true });
// Loan_management_detailModel.sync({ true: true });
// images.sync({ force: true });

// const mortuaryImages = require('./models/operations/ibs/mortuaryImages.model');
// const mortuaryForm = require('./models/operations/ibs/morturayForm.model');

// mortuaryForm.sync({ force: true });
// mortuaryImages.sync({ force: true });

// const coffinForm = require('./models/operations/ibs/coffin.model');
// coffinForm.sync({ force: true });

// CoffinFormModel.sync({ force: true });
// IbsImageModel.sync({ force: true });
// PoliceStationModel.sync({ force: true });
// PoliceStationModel.sync({ alter: true });
// HospitalModel.sync({ alter: true });
// StatusTypeModel.sync({ alter: true });


//const vehicleDetails = require("./models/operations/vehicles/vehicleDetails.model");

//Operations

// Create all the table defined using
// sequelize in Database

// Sync all models that are not
// already in the database
// sequelize.sync();

// Force sync all models
// It will drop the table first
// and re-create it afterwards
/*
 sequelize.sync({force:true})
 UserModel.sync({force:true});  
 RoleModel.sync({force:true});
 ResourceModel.sync({force:true});
 AccessRightModel.sync({force:true});
 AccessModel.sync({force:true});
 TokenModel.sync({force:true});
 ExpenseCategoryModel.sync({force:true});
 VehicleCategoryModel.sync({force:true});
 CenterModel.sync({force:true});
 ItemModel.sync({force:true});
 UnitTypeModel.sync({force:true});
 VehicleDetailModel.sync({force:true});
 IncidentDetailModel.sync({force:true});
 DriverTripLogModel.sync({force:true});
 DriverRouteModel.sync({force:true});
 TransactionMasterModel.sync({force:true});
 TransactionDetailModel.sync({force:true});
 IncidentType.sync({force:true});
 IncidentSeverity.sync({force:true})
 StatusTypeModel.sync({force:true})
 */

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
