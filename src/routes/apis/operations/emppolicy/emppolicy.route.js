const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const empPolicyController = require("../../../../controllers/apis/operations/emppolicy/emppolicy.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const emppolicyValidation = require("../../../../validations/operations/entities/emppolicy.validation");

const router = express.Router();

 router.route("/read-policy").post(auth(), validate(itemValidation.getReceipt), empPolicyController.getEmpPolicyById);
router.route("/read-all-policy").post(auth(), empPolicyController.getAllEmpPolicy);
router.route("/create-policy").post(auth(), validate(emppolicyValidation.createEmpPolicyValidation), empPolicyController.createEmpPolicy);
 router.route("/update-policy").put(auth(), validate(itemValidation.updateReceipt), empPolicyController.updateEmpPolicy);
 router.route("/delete-policy").patch(auth(), validate(itemValidation.deleteReceipt), empPolicyController.deleteEmpPolicy);

module.exports = router;
