const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const deptController = require("../../../../controllers/apis/operations/department/dept.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const deptValidation = require("../../../../validations/operations/entities/deparment.validation");
const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

router.route("/read-dept").post(auth(), validate(itemValidation.getReceipt), deptController.getDeptById);
router.route("/read-all-dept").post(auth(), deptController.getAllDept);
router.route("/read-all-parentDept").post(auth(), deptController.getAllParentDept);
router.route("/create-dept").post(auth(), validate(deptValidation.createDept), deptController.createDept);
router.route("/update-dept").put(auth(), validate(itemValidation.updateReceipt), deptController.updateDept);
router.route("/delete-dept").patch(auth(),validate(itemValidation.deleteReceipt),deptController.deleteDept);
// router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
