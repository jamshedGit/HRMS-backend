const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const desginationController = require("../../../../controllers/apis/operations/designation/designation.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const designationValidation = require("../../../../validations/operations/entities/designation.validation");

const router = express.Router();

router.route("/read-designation").post(auth(), validate(itemValidation.getReceipt), desginationController.getDesignationById);
router.route("/read-all-designation").post(auth(), desginationController.getAllDesignation);
router.route("/create-designation").post(auth(), validate(designationValidation.createDesignationValidation), desginationController.createDesignation);
router.route("/update-designation").put(auth(), validate(itemValidation.updateReceipt), desginationController.updateDesignation);
router.route("/delete-designation").patch(auth(), validate(itemValidation.deleteReceipt), desginationController.deleteDesignation);

module.exports = router;
