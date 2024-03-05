const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const driverRouteController = require("../../../../controllers/apis/operations/transactions/driverRoute.controller");
const driverRouteValidation = require("../../../../validations/operations/transactions/driverRoute.validation");
const router = express.Router();

router.route("/read-driver-route").post(auth(), validate(driverRouteValidation.getDriverRoute), driverRouteController.getDriverRoute);
router.route("/read-all-driver-routes").post(auth(), validate(driverRouteValidation.getDriverRoutes), driverRouteController.getDriverRoutes);
router.route("/create-driver-route").post(auth(), validate(driverRouteValidation.createDriverRoute), driverRouteController.createDriverRoute);
router.route("/update-driver-route").put(auth(), validate(driverRouteValidation.updateDriverRoute), driverRouteController.updateDriverRoute);
router.route("/delete-driver-route").patch(auth(),validate(driverRouteValidation.deleteDriverRoute),driverRouteController.deleteDriverRoute);

module.exports = router;
