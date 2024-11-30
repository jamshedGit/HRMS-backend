const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const controller = require("../../../../controllers/apis/operations/final_settlement_policy/final_settlement_policy.controller");
const itemValidation = require("../../../../validations/operations/entities/final_settlement_policy.validation");

const router = express.Router();

router.route("/read-final-settlement-policy").post(auth(), controller.get_final_settlement_policyById);
router.route("/read-all-final-settlement-policy").post(auth(), controller.usp_GetAllFinalSettlementsPolicy);
router.route("/create-final-settlement-policy").post(auth(), validate(itemValidation.createItem), controller.create_final_settlement_policy);
router.route("/update-final-settlement-policy").put(auth(), validate(itemValidation.updateReceipt), controller.update_final_settlement_policy);
router.route("/delete-final-settlement-policy").patch(auth(),validate(itemValidation.deleteReceipt),controller.delete_final_settlement_policy);
router.route("/insert-final-settlement-policy").post( controller.usp_InsertFinalSettlementPolicy);
module.exports = router;
