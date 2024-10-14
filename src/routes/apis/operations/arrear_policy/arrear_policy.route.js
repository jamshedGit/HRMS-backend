const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/arrear_policy/arrear_policy.controller");
const itemValidation = require("../../../../validations/operations/entities/arrear_policy.validation");

const router = express.Router();

router.route("/read-arrear-policy/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getArrearById);
router.route("/read-all-arrear-policy").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllArrearPolicies);
router.route("/create-arrear-policy").post(auth(), validate(itemValidation.createItem), form_controller.createArrearPolicy);
router.route("/update-arrear-policy").put(auth(), validate(itemValidation.updateitem), form_controller.updateArrearPolicy);
router.route("/delete-arrear-policy/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteArrear);

module.exports = router;
