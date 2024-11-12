const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/leave_encashment/leave_encashment.controller");
const itemValidation = require("../../../../validations/operations/entities/leave_encashment.validation");

const router = express.Router();

router.route("/create-leave-encashment").post(auth(), validate(itemValidation.createItem), form_controller.createLeaveEncashment);
router.route("/read-all-leave-encashment").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllLeaveEncashment);
router.route("/read-leave-encashment/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getLeaveEncashmentById);
router.route("/delete-leave-encashment/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteLeaveEncashment);

module.exports = router;
