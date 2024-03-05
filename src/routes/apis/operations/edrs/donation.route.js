const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const receiptController = require("../../../../controllers/apis/operations/edrs/receipt.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

router.route("/read-receipt").post(auth(), validate(itemValidation.getReceipt), receiptController.getReceipt);
router.route("/read-all-receipt").post(auth(), validate(itemValidation.getReceipts), receiptController.getReceipts);
router.route("/create-receipt").post(auth(), validate(itemValidation.createReceipt), receiptController.createReceipt);
router.route("/update-receipt").put(auth(), validate(itemValidation.updateReceipt), receiptController.updateReceipt);
router.route("/delete-receipt").patch(auth(),validate(itemValidation.deleteReceipt),receiptController.deleteReceipt);
router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
