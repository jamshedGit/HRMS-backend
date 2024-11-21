const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/employee_roster/employee_roster.controller");
const itemValidation = require("../../../../validations/operations/entities/employee_roster.validation");

const router = express.Router();

router.route("/create-employee-roster").post(auth(), validate(itemValidation.createItem), form_controller.createemployeeRoster);
router.route("/update-employee-roster").put(auth(), validate(itemValidation.updateItem), form_controller.updateemployeeRoster);
router.route("/read-all-employee-roster").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllemployeeRoster);
router.route("/read-employee-roster/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getemployeeRosterById);
router.route("/delete-employee-roster/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteemployeeRoster);

module.exports = router;
