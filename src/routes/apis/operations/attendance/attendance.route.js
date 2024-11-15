const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/attendance/attendance.controller");
const itemValidation = require("../../../../validations/operations/entities/attendance.validation");

const router = express.Router();

router.route("/create-attendance").post(auth(), validate(itemValidation.createItem), form_controller.createattendance);
router.route("/update-attendance").put(auth(), validate(itemValidation.updateItem), form_controller.updateattendance);
router.route("/read-all-attendance").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllattendance);
router.route("/read-attendance/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getattendanceById);
router.route("/delete-attendance/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteattendance);

module.exports = router;
