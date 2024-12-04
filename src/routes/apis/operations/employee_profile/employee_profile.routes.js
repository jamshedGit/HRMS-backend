const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const employee_profileController = require("../../../../controllers/apis/operations/employee_profile/employee_profile.controller");

const employee_profileValidation = require("../../../../validations/operations/entities/accure_gratuity_configuration.validation");

const router = express.Router();

router.route("/read-employee-profile").post(auth(), employee_profileController.getemployee_profileById);
router.route("/read-all-employee-profile").post(auth(),employee_profileController.getAllemployee_profile);

router.route("/update-employee-profile").put(auth(),  employee_profileController.updateemployee_profile);
router.route("/delete-employee-profile").patch(auth(),employee_profileController.deleteemployee_profile);


router.route("/create-employee-profile").post(auth(), employee_profileController.createemployee_profile);


module.exports = router;
