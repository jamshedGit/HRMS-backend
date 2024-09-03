const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const religionController = require("../../../../controllers/apis/operations/religion/religion.conroller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const religionValidation = require("../../../../validations/operations/entities/religion.validation");
const router = express.Router();

router.route("/read-religion").post(auth(), validate(itemValidation.getReceipt), religionController.getReligionById);
router.route("/read-all-religion").post(auth(), religionController.getAllReligions);
router.route("/create-religion").post(auth(), validate(religionValidation.createReligionValidation), religionController.createReligion);
router.route("/update-religion").put(auth(), validate(itemValidation.updateReceipt), religionController.updateReligion);
router.route("/delete-religion").patch(auth(),validate(itemValidation.deleteReceipt),religionController.deleteReligion);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
