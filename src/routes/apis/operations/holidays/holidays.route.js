const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const holidaysController = require("../../../../controllers/apis/operations/holidays/holidays.controller");

const holidaysValidation = require("../../../../validations/operations/entities/holidays.validation");

const router = express.Router();

router.route("/read-holidays").post(auth(), holidaysController.getholidaysById);
router.route("/read-all-holidays").post(auth(),holidaysController.getAllholidays);

router.route("/update-holidays").put(auth(),  holidaysController.updateholidays);
router.route("/delete-holidays").patch(auth(),holidaysController.deleteholidays);


router.route("/create-holidays").post(auth(), validate(holidaysValidation.createholidaysValidation),holidaysController.createholidays);


module.exports = router;
