const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const vehicleCategoryController = require("../../../../controllers/apis/operations/vehicles/vehicleCategory.controller");
const vehicleCategoryValidation = require("../../../../validations/operations/vehicles/vehicleCategory.validation");
const router = express.Router();

router.route("/read-vehicle-category").post(auth(), validate(vehicleCategoryValidation.getVehicleCategory), vehicleCategoryController.getVehicleCategory);
router.route("/read-all-vehicle-categorys").post(auth(), validate(vehicleCategoryValidation.getVehicleCategories), vehicleCategoryController.getVehicleCategories);
router.route("/create-vehicle-category").post(auth(), validate(vehicleCategoryValidation.createVehicleCategory), vehicleCategoryController.createVehicleCategory);
router.route("/update-vehicle-category").put(auth(), validate(vehicleCategoryValidation.updateVehicleCategory), vehicleCategoryController.updateVehicleCategory);
router.route("/delete-vehicle-category").patch(auth(),validate(vehicleCategoryValidation.deleteVehicleCategory),vehicleCategoryController.deleteVehicleCategory);

module.exports = router;
