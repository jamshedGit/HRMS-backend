const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const controller = require("../../../../controllers/apis/operations/onetime_allowance/onetime_allowance.controller");
const itemValidation = require("../../../../validations/operations/entities/onetime_earning.validation");

const router = express.Router();

router.route("/read-onetime-earning").post(auth(), controller.get_onetime_earningById);
router.route("/read-all-onetime-earning").post(auth(), controller.usp_GetAllOnetimeAllowanceDetails);
router.route("/create-onetime-earning").post(auth(), validate(itemValidation.createItem), controller.usp_InsertOneTimeEarning);
router.route("/update-onetime-earning").put(auth(), validate(itemValidation.updateReceipt), controller.update_onetime_earning);
router.route("/delete-onetime-earning").patch(auth(),validate(itemValidation.deleteReceipt),controller.delete_onetime_earning);
//router.route("/insert-onetime-earning").post( controller.usp_InsertFinalSettlementPolicy);
module.exports = router;
