const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/leave_register/leave_register.controller");
const itemValidation = require("../../../../validations/operations/entities/leave_register.validation");

const router = express.Router();

router.route("/read-all-registered-leaves").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllRegisteredLeaves);

module.exports = router;
