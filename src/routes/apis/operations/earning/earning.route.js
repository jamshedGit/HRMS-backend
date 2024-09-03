const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const earningController = require("../../../../controllers/apis/operations/earning/earning.controller");

const earningValidation = require("../../../../validations/operations/entities/earning.validation");

const router = express.Router();

router.route("/read-earning").post(auth(), validate(earningValidation.createEarningValidation1), earningController.getEarningById);
router.route("/read-all-earning").post(auth(), earningController.getAllEarning);
router.route("/read-all-earning_by_employeeId").post( earningController.SP_getAllEarningInfoByEmpId);
router.route("/create-earning").post(auth(), validate(earningValidation.createEarningValidation), earningController.createEarning);
router.route("/update-earning").put(auth(), earningController.updateEarning);
router.route("/delete-earning").patch(auth(), earningController.deleteEarning);

module.exports = router;
