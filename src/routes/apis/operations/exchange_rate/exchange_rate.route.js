const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const exchange_rateController = require("../../../../controllers/apis/operations/echange_rate/exchange_rate.controller");

const exchnage_rate_Validation = require("../../../../validations/operations/entities/exchange_rate.validation");

const router = express.Router();

router.route("/read-exchange-rate").post(auth(), validate(exchnage_rate_Validation.createExchangeRateValidation1), exchange_rateController.getExchangeRateById);
router.route("/read-all-exchange-rate").post(auth(), exchange_rateController.getAllExchangeRate);
//router.route("/read-all-stoppage_by_employeeId").post(exchange_rateController.SP_getAllStoppageAllowanceInfoByEmpId);
router.route("/create-exchange-rate").post(auth(), validate(exchnage_rate_Validation.createExchangeRateValidation), exchange_rateController.createExchangeRate);
router.route("/update-exchange-rate").put(auth(), exchange_rateController.updateExchangeRate);
router.route("/delete-exchange-rate").patch(auth(), exchange_rateController.deleteExchangeRate);
//router.route("/read-earning-deduction-list").post(exchange_rateController.SP_getAllEarningDeductionList);


module.exports = router;
