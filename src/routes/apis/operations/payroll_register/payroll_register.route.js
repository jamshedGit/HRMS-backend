const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/payroll_register/payroll_register.controller");
const itemValidation = require("../../../../validations/operations/entities/payroll_register.validation");

const router = express.Router();

router.route("/read-all-registered-payroll").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllRegisteredPayroll);
router.route("/generate-payslip-pdf").post(auth(), validate(itemValidation.getItemForPdf), form_controller.generatePayslip);

module.exports = router;
