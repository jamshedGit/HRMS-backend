const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const gratuity_configurationController = require("../../../../controllers/apis/operations/gratuity_configuration/gratuity_configuration.controller");

const gratuity_configurationValidation = require("../../../../validations/operations/entities/gratuity_configuration.validation");

const router = express.Router();

router.route("/read-gratuity-configuration").post(auth(), gratuity_configurationController.getgratuity_configurationById);
router.route("/read-all-gratuity-configuration").post(auth(),gratuity_configurationController.getAllgratuity_configuration);

router.route("/update-gratuity-configuration").put(auth(),  gratuity_configurationController.updategratuity_configuration);
router.route("/delete-gratuity-configuration").patch(auth(),gratuity_configurationController.deletegratuity_configuration);


router.route("/create-gratuity-configuration").post(auth(), validate(gratuity_configurationValidation.createGratuity_configurationValidation),gratuity_configurationController.creategratuity_configuration);


module.exports = router;
