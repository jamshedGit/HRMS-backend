const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const driverTriplogController = require("../../../../controllers/apis/operations/transactions/driverTriplog.controller");
const driverTriplogValidation = require("../../../../validations/operations/transactions/driverTriplog.validate");
const router = express.Router();

router.route("/read-driver-trip-log").post(auth(), validate(driverTriplogValidation.getDriverTriplog), driverTriplogController.getDriverTriplog);
router.route("/read-all-driver-trip-logs").post(auth(), validate(driverTriplogValidation.getDriverTriplogs), driverTriplogController.getDriverTriplogs);
router.route("/create-driver-trip-log").post(auth(), validate(driverTriplogValidation.createDriverTriplog), driverTriplogController.createDriverTriplog);
router.route("/update-driver-trip-log").put(auth(), validate(driverTriplogValidation.updateDriverTriplog), driverTriplogController.updateDriverTriplog);
router.route("/delete-driver-trip-log").patch(auth(),validate(driverTriplogValidation.deleteDriverTriplog),driverTriplogController.deleteDriverTriplog);
router.route("/read-all-driver-trip-logs-by-incidentId").post(auth(), validate(driverTriplogValidation.getDriverTriplogByIncidentId), driverTriplogController.getDriverTriplogsByIncidentId);
router.route("/read-all-driver-trip-logs-by-vehicleId").post(auth(), validate(driverTriplogValidation.getDriverTriplogByVehicleId), driverTriplogController.getDriverTriplogByVehicleId);

module.exports = router;
