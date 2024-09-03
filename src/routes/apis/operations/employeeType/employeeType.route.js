const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const empType = require("../../../../controllers/apis/operations/employeeType/employeeType.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const deptValidation = require("../../../../validations/operations/entities/deparment.validation");
const receiptValidation = require("../../../../validations/operations/entities/receipt.validation");
const router = express.Router();

// router.route("/read-emptype").post(auth(), validate(itemValidation.getReceipt), deptController.getDeptById);
router.route("/read-all-emptype").post(auth(), empType.getAllEmployeeType);
// router.route("/create-emptype").post(auth(), validate(deptValidation.createDept), deptController.createDept);
// router.route("/update-emptype").put(auth(), validate(itemValidation.updateReceipt), deptController.updateDept);
// router.route("/delete-emptype").patch(auth(),validate(itemValidation.deleteReceipt),deptController.deleteDept);
// // router.route("/donation-report").post(auth(),validate(receiptValidation.getDonationReceiptByBookNo),receiptController.getDonationReceiptReport);
module.exports = router;
