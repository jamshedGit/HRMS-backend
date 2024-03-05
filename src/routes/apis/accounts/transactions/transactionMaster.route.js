const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const transactionMasterController = require("../../../../controllers/apis/accounts/transactions/transactionMaster.controller");
const transactionMasterValidation = require("../../../../validations/accounts/transactions/transactionMaster.validation");
const router = express.Router();

router.route("/read-transaction-master").post(auth(),validate(transactionMasterValidation.getTransactionMaster),transactionMasterController.getTransactionMaster);
router.route("/read-all-transaction-masters").post(auth(),validate(transactionMasterValidation.getTransactionMasters),transactionMasterController.getTransactionMasters);
router.route("/create-transaction-master").post(auth(),validate(transactionMasterValidation.createTransactionMaster),transactionMasterController.createTransactionMaster);
router.route("/update-transaction-master").put(auth(),validate(transactionMasterValidation.updateTransactionMaster),transactionMasterController.updateTransactionMaster);
router.route("/delete-transaction-master").patch(auth(),validate(transactionMasterValidation.deleteTransactionMaster),transactionMasterController.deleteTransactionMaster);

module.exports = router;