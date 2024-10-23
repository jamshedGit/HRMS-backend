const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const accrue_gratuity_configurationController = require("../../../../controllers/apis/operations/accrue_gratuity_configuration/accrue_gratuity_configuration.controller");

const accrue_gratuity_configurationValidation = require("../../../../validations/operations/entities/accure_gratuity_configuration.validation");

const router = express.Router();

router.route("/read-accrue-gratuity-configuration").post(auth(), accrue_gratuity_configurationController.getaccrue_gratuity_configurationById);
router.route("/read-all-accrue-gratuity-configuration").post(auth(),accrue_gratuity_configurationController.getAllaccrue_gratuity_configuration);

router.route("/update-accrue-gratuity-configuration").put(auth(),  accrue_gratuity_configurationController.updateaccrue_gratuity_configuration);
router.route("/delete-accrue-gratuity-configuration").patch(auth(),accrue_gratuity_configurationController.deleteaccrue_gratuity_configuration);


router.route("/create-accrue-gratuity-configuration").post(auth(), validate(accrue_gratuity_configurationValidation.CreateAccrue_gratuity_configurationValidation),accrue_gratuity_configurationController.createaccrue_gratuity_configuration);


module.exports = router;
