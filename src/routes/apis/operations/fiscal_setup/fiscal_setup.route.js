const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/fiscal_setup/fiscal_setup.contoller");
const itemValidation = require("../../../../validations/operations/entities/fiscal_setup.validation");

const router = express.Router();

router.route("/read-fiscal-setup").post(auth(), validate(itemValidation.createItem1), form_controller.getFiscalSetupById);
router.route("/read-all-fiscal-setup").post(auth(), validate(itemValidation.createItem1), form_controller.getAllFiscalSetup);
router.route("/create-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.createFiscalSetup);
router.route("/update-fiscal-setup").put(auth(), validate(itemValidation.updateReceipt), form_controller.updateFiscalSetup);
router.route("/delete-fiscal-setup").patch(auth(),validate(itemValidation.deleteReceipt),form_controller.deleteFiscalSetup);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
