const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/upload/upload.controller");
const itemValidation = require("../../../../validations/operations/entities/upload.validation");
const { uploadExcel } = require("../../../../middlewares/fileUpload.middleware");

const router = express.Router();

router.route("/download-template").post(auth(), validate(itemValidation.downloadFiles), form_controller.downloadTemplate);
router.route("/save-leave-data").post(auth(), uploadExcel(), form_controller.saveLeaveData);

module.exports = router;
