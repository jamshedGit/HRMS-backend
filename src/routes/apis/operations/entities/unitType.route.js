const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const unitTypeController = require("../../../../controllers/apis/operations/entities/unitType.controller");
const unitTypeValidation = require("../../../../validations/operations/entities/unitType.validation");
const router = express.Router();

router.route("/read-unit-type").post(auth(), validate(unitTypeValidation.getUnitType), unitTypeController.getUnitType);
router.route("/read-all-unit-types").post(auth(), validate(unitTypeValidation.getUnitTypes), unitTypeController.getUnitTypes);
router.route("/create-unit-type").post(auth(), validate(unitTypeValidation.createUnitType), unitTypeController.createUnitType);
router.route("/update-unit-type").put(auth(), validate(unitTypeValidation.updateUnitType), unitTypeController.updateUnitType);
router.route("/delete-unit-type").patch(auth(),validate(unitTypeValidation.deleteUnitType),unitTypeController.deleteUnitType);

module.exports = router;
