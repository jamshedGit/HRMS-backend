const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/salary_rounding_policy/salary_rounding_policy.controller");
const itemValidation = require("../../../../validations/operations/entities/salary_rounding_policy.validation");

const router = express.Router();

router.route("/read-rounding-policy/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getAllRoundingPolicyById);
router.route("/read-payment-mode/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getPaymentMode);
router.route("/read-all-rounding-policy").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllRoundingPolicies);
router.route("/create-rounding-policy").post(auth(), validate(itemValidation.createItem), form_controller.createRoundingPolicy);
router.route("/update-rounding-policy").put(auth(), validate(itemValidation.updateItem), form_controller.updateRoundingPolicy);
router.route("/delete-rounding-policy/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteRoundingPolicy);

module.exports = router;
