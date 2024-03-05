const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/apis/user.controller');

const router = express.Router();

router.route('/get-user-by-token').post(auth(), validate(userValidation.getUserByToken), userController.getUserByToken);
router.route('/create-user').post(auth(), validate(userValidation.createUser), userController.createUser);
router.route('/read-user').post(auth(), validate(userValidation.getUser), userController.getUser);
router.route('/read-all-users').post(auth(), validate(userValidation.getUsers), userController.getUsers);
router.route('/update-user').put(auth(), validate(userValidation.updateUser), userController.updateUser);
router.route('/delete-user').patch(auth(), validate(userValidation.deleteUser), userController.deleteUser);

// router.route('/:roleId/get-role-access').get(auth(), validate(userValidation.getUserRoleAccess), userController.getUserRoleAccess);
// router.route('/create-role').post(auth(), userController.getUserAccessForMiddleware);
// router.route('/read-all-reset-password-users').post(auth(), validate(userValidation.allResetPassUsers), userController.allResetPassUsers);
// router.route('/create-new-password').post(auth(), validate(userValidation.createNewPassword), userController.createNewPassword);
// router.route('/update-reset-password').post(auth(), validate(userValidation.adminResetPassword), userController.adminResetPassword);


module.exports = router;

