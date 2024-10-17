const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/payroll_process_policy/payroll_process_policy.controller");
const itemValidation = require("../../../../validations/operations/entities/payroll_process_policy.validation");

const router = express.Router();

router.route("/read-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.get_Payroll_Process_PolicyById);
router.route("/read-all-fiscal-setup").post(auth(), form_controller.getAll_Payroll_Process_Policy);
router.route("/create-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.create_Payroll_Process_Policy);
router.route("/update-fiscal-setup").put(auth(), validate(itemValidation.updateReceipt), form_controller.update_Payroll_Process_Policy);
router.route("/delete-fiscal-setup").patch(auth(),validate(itemValidation.deleteReceipt),form_controller.delete_Payroll_Process_Policy);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
