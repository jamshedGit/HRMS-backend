const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/allocate_leaves/allocate_leaves.controller");
const itemValidation = require("../../../../validations/operations/entities/allocate_leaves.validation");

const router = express.Router();

router.route("/create-allocate-leaves").post(auth(), validate(itemValidation.createItem), form_controller.createallocateLeaves);
// router.route("/update-allocate-leaves").put(auth(), validate(itemValidation.updateItem), form_controller.updateallocateLeaves);
router.route("/read-policy-type-dropdown").get(validate(itemValidation.getItemWihoutId), form_controller.getPolicyTypeDropdown);
router.route("/read-all-allocate-leaves").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllAllocateLeaves);
// router.route("/read-allocate-leaves/:id").get(auth(), validate(itemValidation.getSingleItem), form_controller.getallocateLeavesById);
// router.route("/delete-allocate-leaves/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteallocateLeaves);

module.exports = router;
