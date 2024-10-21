const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const bankController = require("../../../../controllers/apis/operations/bank/bank.contoller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const bankValidation = require("../../../../validations/operations/entities/bank.validation");
const router = express.Router();

router.route("/read-bank").post(auth(), validate(itemValidation.getReceipt), bankController.getBankById);
router.route("/read-all-banks").post(auth(), validate(itemValidation.getReceipts), bankController.getAllBanks);
router.route("/create-bank").post(auth(), validate(bankValidation.createBankValidation), bankController.createBank);
router.route("/update-bank").put(auth(), validate(itemValidation.updateReceipt), bankController.updateBank);
router.route("/delete-bank").patch(auth(),validate(itemValidation.deleteReceipt),bankController.deleteBank);
module.exports = router;
