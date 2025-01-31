const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const userController = require("../../../../controllers/apis/operations/user/user.controller");

const userValidation = require("../../../../validations/operations/entities/user.validation");
const router = express.Router();

router.route("/reset-password").post(auth(true), validate(userValidation.resetPassword),userController.resetPassword);


module.exports = router;


