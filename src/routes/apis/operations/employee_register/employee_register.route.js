const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/employee_register/employee_register.controller");
const itemValidation = require("../../../../validations/operations/entities/employee_register.validation");

const router = express.Router();

router.route("/read-all-registered-employees").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllRegisteredEmployees);
router.route("/read-all-registered-employees-pdf-data").post(auth(), validate(itemValidation.getItemForPdf), form_controller.getAllRegisteredEmployeesPdfData);

module.exports = router;
