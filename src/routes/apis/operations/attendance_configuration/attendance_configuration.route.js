const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/attendance_configuration/attendance_configuration.controller");
const itemValidation = require("../../../../validations/operations/entities/attendance_configuration.validation");

const router = express.Router();

router.route("/create-att-configuration").post(auth(), validate(itemValidation.createItem), form_controller.createAttendanceConfiguration);
router.route("/update-att-configuration").put(auth(), validate(itemValidation.updateItem), form_controller.updateAttendanceConfiguration);
router.route("/read-all-att-configuration").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllAttendanceConfiguration);
router.route("/read-att-configuration/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getAttendanceConfigurationById);
router.route("/delete-att-configuration/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteAttendanceConfiguration);

module.exports = router;
