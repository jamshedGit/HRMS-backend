const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/tax_setup/tax_setup.contoller");
const itemValidation = require("../../../../validations/operations/entities/tax_setup.validation");

const router = express.Router();

router.route("/read-tax-setup").post(auth(), validate(itemValidation.createItem1), form_controller.getTaxSetupById);
router.route("/read-all-tax-setup").post(auth(), validate(itemValidation.createItem1), form_controller.getAllTaxSetup);
router.route("/create-tax-setup").post(auth(), validate(itemValidation.createItem), form_controller.createTaxSetup);
router.route("/update-tax-setup").put(auth(), validate(itemValidation.updateReceipt), form_controller.updateTaxSetup);
router.route("/delete-tax-setup").patch(auth(),validate(itemValidation.deleteReceipt),form_controller.deleteTaxSetup);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
