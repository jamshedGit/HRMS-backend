const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/payroll_month_setup/payroll_month_setup.controller");
const itemValidation = require("../../../../validations/operations/entities/payroll_month_setup.validation");

const router = express.Router();

router.route("/read-payroll-month").post(auth(), validate(itemValidation.createItem1), form_controller.getPayrollMonthById);
router.route("/read-all-payroll-month").post(auth(), validate(itemValidation.createItem1), form_controller.getAllPayrollMonth);
router.route("/create-payroll-month").post(auth(), validate(itemValidation.createItem), form_controller.createPayrollMonth);
router.route("/update-payroll-month").put(auth(), validate(itemValidation.updateItem), form_controller.updatePayrollMonth);
router.route("/delete-payroll-month").patch(auth(),validate(itemValidation.deleteItem),form_controller.deletePayrollMonth);
router.route("/get-payroll-month-previous-date").post(form_controller.SP_GetActivePreviousPayrollMonth);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
