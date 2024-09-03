const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const earningTranController = require("../../../../controllers/apis/operations/earning_transaction/earning_transaction.controller");

const earningTranValidation = require("../../../../validations/operations/entities/earning_transaction.validation");

const router = express.Router();

router.route("/read-earning-transaction").post(auth(), validate(earningTranValidation.createEarningTranValidation1), earningTranController.getEarningTranById);
router.route("/read-all-earning-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/read-all-deduction-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/read-all-earning_byId").post( earningTranController.SP_getAllEarningTranInfoByEmpId);
router.route("/create-earning-transaction").post(auth(), validate(earningTranValidation.createEarningTranValidation), earningTranController.createEarningTran);
router.route("/update-earning-transaction").put(auth(), earningTranController.updateEarningTran);
router.route("/delete-earning-transaction").patch(auth(), earningTranController.deleteEarningTran);

module.exports = router;
