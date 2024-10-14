const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const salarypolicyController = require("../../../../controllers/apis/operations/salarypolicy/salarypolicy.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const salarypolicyValidation = require("../../../../validations/operations/entities/salarypolicy.validation");

const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

router.route("/read-salarypolicy").post(auth(), validate(itemValidation.getReceipt), salarypolicyController.getsalarypolicyById);
router.route("/read-all-salarypolicy").post(auth(), validate(itemValidation.getReceipts), salarypolicyController.getAllsalarypolicys);

router.route("/update-salarypolicy").put(auth(), validate(itemValidation.updateReceipt), salarypolicyController.updatesalarypolicy);
router.route("/delete-salarypolicy").patch(auth(),validate(itemValidation.deleteReceipt),salarypolicyController.deletesalarypolicy);


router.route("/create-salarypolicy").post(auth(), validate(salarypolicyValidation.createSalarypolicyValidation),salarypolicyController.createsalarypolicy);
router.route("/read-currentmonth").get(auth(), validate(salarypolicyValidation.getCurrentMonth),salarypolicyController.getCurrentMonth);

module.exports = router;