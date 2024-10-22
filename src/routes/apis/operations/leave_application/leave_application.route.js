const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/leave_application/leave_application.controller");
const itemValidation = require("../../../../validations/operations/entities/leave_application.validation");

const router = express.Router();

router.route("/create-leave-application").post(auth(), validate(itemValidation.createItem), form_controller.createleaveApplication);
router.route("/update-leave-application").put(auth(), validate(itemValidation.updateItem), form_controller.updateleaveApplication);
router.route("/read-all-leave-application").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllleaveApplication);
router.route("/read-leave-application/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getleaveApplicationById);
router.route("/delete-leave-application/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteleaveApplication);

module.exports = router;
