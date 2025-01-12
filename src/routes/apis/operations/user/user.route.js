const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const userController = require("../../../../controllers/apis/operations/user/user.controller");

const userValidation = require("../../../../validations/operations/entities/user.validation");
const router = express.Router();

router.route("/read-user").post(auth(), userController.getUser);
router.route("/read-all-user").post(auth(),  userController.getAllUser);
router.route("/update-user").put(auth(),  userController.updateUser);
router.route("/delete-user").patch(auth(),userController.deleteUser);


router.route("/create-user").post(auth(), validate(userValidation.createUser),userController.createUser);



module.exports = router;


