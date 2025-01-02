const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const payroll_processController = require("../../../../controllers/apis/operations/payroll_process/payroll_process.controller");

const payroll_processValidation = require("../../../../validations/operations/entities/payroll_process.validation.js");
const router = express.Router();

router.route("/read-payroll-process").post(auth(), payroll_processController.getPayroll_ProcessById);
router.route("/read-all-payroll-process").post(auth(),  payroll_processController.getAllPayroll_Process);
// router.route("/create-payroll_process").post(auth(), payroll_processController.createpayroll_process);
router.route("/update-payroll-process").put(auth(),  payroll_processController.updatePayroll_Process);
router.route("/delete-payroll-process").patch(auth(),payroll_processController.deletePayroll_Process);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);

router.route("/create-payroll-process").post(auth(), payroll_processController.createPayroll_Process);
router.route("/read-all-payroll-group-detail").post(payroll_processController.payroll_group_detail)
router.route("/check-payroll-employees").post(payroll_processController.checkPayroll_EmployeesByIds)
module.exports = router;
