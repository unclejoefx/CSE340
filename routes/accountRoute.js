// Importing all external resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index'); 
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

// Login route
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// login attempt
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getAccountManagement));


// Export router
module.exports = router;