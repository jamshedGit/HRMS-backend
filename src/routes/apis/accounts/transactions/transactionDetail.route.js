const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const transactionDetailController = require("../../../../controllers/apis/accounts/transactions/transactionDetail.controller");
const transactionDetailValidation = require("../../../../validations/accounts/transactions/transactionDetail.validation");
const router = express.Router();

router.route("/read-transaction-detail").post(auth(),validate(transactionDetailValidation.getTransactionDetail),transactionDetailController.getTransactionDetail);
router.route("/read-all-transaction-details").post(auth(),validate(transactionDetailValidation.getTransactionDetails),transactionDetailController.getTransactionDetails);
router.route("/create-transaction-detail").post(auth(),validate(transactionDetailValidation.createTransactionDetail),transactionDetailController.createTransactionDetail);
router.route("/update-transaction-detail").put(auth(),validate(transactionDetailValidation.updateTransactionDetail),transactionDetailController.updateTransactionDetail);
router.route("/delete-transaction-detail").patch(auth(),validate(transactionDetailValidation.deleteTransactionDetail),transactionDetailController.deleteTransactionDetail);

module.exports = router;