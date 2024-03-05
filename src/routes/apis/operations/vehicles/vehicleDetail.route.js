const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const vehicleDetailController = require("../../../../controllers/apis/operations/vehicles/vehicleDetail.controller");
const vehicleDetailValidation = require("../../../../validations/operations/vehicles/vehicleDetail.validation");
const router = express.Router();

router.route("/read-vehicle").post(auth(), validate(vehicleDetailValidation.getVehicleDetail), vehicleDetailController.getVehicleDetail);
router.route("/read-all-vehicles").post(auth(), validate(vehicleDetailValidation.getVehicleDetails), vehicleDetailController.getVehicleDetails);
router.route("/read-all-vehicles-by-centerId").post(auth(),validate(vehicleDetailValidation.getVehicleDetailbyCenterId),vehicleDetailController.getVehicleDetailbyCenterId);
router.route("/create-vehicle").post(auth(), validate(vehicleDetailValidation.createVehicleDetail), vehicleDetailController.createVehicleDetail);
router.route("/update-vehicle").put(auth(), validate(vehicleDetailValidation.updateVehicleDetail), vehicleDetailController.updateVehicleDetail);
router.route("/update-vehicle-status").put(auth(), validate(vehicleDetailValidation.updateVehicleStatusDetail), vehicleDetailController.updateVehicleStatusDetail);
router.route("/delete-vehicle").patch(auth(),validate(vehicleDetailValidation.deleteVehicleDetail),vehicleDetailController.deleteVehicleDetail);


module.exports = router;
