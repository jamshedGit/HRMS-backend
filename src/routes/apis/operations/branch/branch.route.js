const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const branchController = require("../../../../controllers/apis/operations/branch/branch.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const bankValidation = require("../../../../validations/operations/entities/bank.validation");
const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

router.route("/read-branch").post(auth(), validate(itemValidation.getReceipt), branchController.getBranchById);
router.route("/read-all-branch").post(auth(), branchController.getAllBranch);
router.route("/create-branch").post(auth(), validate(bankValidation.createBranchValidation), branchController.createBranch);
router.route("/update-branch").put(auth(), validate(itemValidation.updateReceipt), branchController.updateBranch);
router.route("/delete-branch").patch(auth(),validate(itemValidation.deleteReceipt),branchController.deleteBranch);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
