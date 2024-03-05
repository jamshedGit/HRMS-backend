const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const expenseCategoryController = require("../../../../controllers/apis/accounts/incomeExpenses/expenseCategory.controller");
const expenseCategoriesValidation = require("../../../../validations/accounts/incomeExpenses/expenseCategories.validation");
const router = express.Router();

router.route("/read-expense-category").post(auth(),validate(expenseCategoriesValidation.getExpenseCategory),expenseCategoryController.getExpenseCategory);
router.route("/read-all-expense-categories").post(auth(),validate(expenseCategoriesValidation.getExpenseCategories),expenseCategoryController.getExpenseCategories);
router.route("/create-expense-category").post(auth(),validate(expenseCategoriesValidation.createExpenseCategory),expenseCategoryController.createExpenseCategory);
router.route("/update-expense-category").put(auth(),validate(expenseCategoriesValidation.updateExpenseCategory),expenseCategoryController.updateExpenseCategory);
router.route("/delete-expense-category").patch(auth(),validate(expenseCategoriesValidation.deleteExpenseCategory),expenseCategoryController.deleteExpenseCategory);

module.exports = router;