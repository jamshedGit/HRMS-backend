const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/leave_type/leave_type.controller");
const itemValidation = require("../../../../validations/operations/entities/leave_type.validation");

const router = express.Router();

router.route("/create-leave-type").post(auth(), validate(itemValidation.createItem), form_controller.createLeaveType);
router.route("/update-leave-type").put(auth(), validate(itemValidation.updateItem), form_controller.updateLeaveType);
router.route("/read-all-leave-type").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllLeaveType);
router.route("/read-leave-type/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getLeaveTypeById);
router.route("/delete-leave-type/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteLeaveType);

module.exports = router;
