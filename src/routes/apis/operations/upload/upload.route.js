const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/upload/upload.controller");
const itemValidation = require("../../../../validations/operations/entities/upload.validation");

const router = express.Router();

router.route("/download-template").post(auth(), validate(itemValidation.downloadFiles), form_controller.downloadTemplate);

module.exports = router;
