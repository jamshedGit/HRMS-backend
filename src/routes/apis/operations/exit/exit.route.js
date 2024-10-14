const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const exitController = require("../../../../controllers/apis/operations/exit/exit.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const exitValidation = require("../../../../validations/operations/entities/exit.validation");

const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

router.route("/read-exit").post(auth(), validate(itemValidation.getReceipt), exitController.getexitById);
router.route("/read-all-exit").post(auth(), validate(itemValidation.getReceipts), exitController.getAllexits);
router.route("/create-exit").post(auth(), exitController.createexit);
router.route("/update-exit").put(auth(), validate(itemValidation.updateReceipt), exitController.updateexit);
router.route("/delete-exit").patch(auth(),validate(itemValidation.deleteReceipt),exitController.deleteexit);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
