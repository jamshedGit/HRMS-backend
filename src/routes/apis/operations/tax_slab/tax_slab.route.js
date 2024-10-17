const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const tax_slabController = require("../../../../controllers/apis/operations/tax_slab/tax_slab.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const tax_slabValidation = require("../../../../validations/operations/entities/tax_slab.validation");


const router = express.Router();

router.route("/read-tax-slab").post(auth(), validate(itemValidation.getReceipt), tax_slabController.gettax_slabById);
router.route("/read-all-tax-slab").post(auth(), validate(itemValidation.getReceipts), tax_slabController.getAlltax_slabs);
// router.route("/create-tax_slab").post(auth(), tax_slabController.createtax_slab);
router.route("/update-tax-slab").put(auth(), validate(itemValidation.updateReceipt), tax_slabController.updatetax_slab);
router.route("/delete-tax-slab").patch(auth(),validate(itemValidation.deleteReceipt),tax_slabController.deletetax_slab);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);

router.route("/create-tax-slab").post(auth(), validate(tax_slabValidation.createTax_slabValidation),tax_slabController.createtax_slab);
module.exports = router;
