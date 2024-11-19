const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/employee_shift/employee_shift.controller");
const itemValidation = require("../../../../validations/operations/entities/employee_shift.validation");

const router = express.Router();

router.route("/create-employee-shift").post(auth(), validate(itemValidation.createItem), form_controller.createEmployeeShift);
router.route("/update-employee-shift").put(auth(), validate(itemValidation.updateItem1), form_controller.updateEmployeeShift);
router.route("/read-all-employee-shift").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllEmployeeShift);
router.route("/read-employee-shift/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getEmployeeShiftById);
router.route("/delete-employee-shift/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteEmployeeShift);

module.exports = router;
