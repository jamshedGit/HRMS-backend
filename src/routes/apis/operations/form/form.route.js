const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const formController = require("../../../../controllers/apis/operations/form/form.controller");
const itemValidation = require("../../../../validations/operations/entities/form.validation");
const formValidation = require("../../../../validations/operations/entities/bank.validation");
const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

router.route("/read-form").post(auth(), validate(itemValidation.getReceipt), formController.getFormById);
router.route("/read-all-form").post(auth(), formController.getAllParentChildForms);
router.route("/create-form").post(auth(), validate(itemValidation.createForm), formController.createForm);
router.route("/update-form").put(auth(), validate(itemValidation.updateForm), formController.updateForm);
router.route("/delete-form").patch(auth(),validate(itemValidation.deleteForm),formController.deleteForm);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
