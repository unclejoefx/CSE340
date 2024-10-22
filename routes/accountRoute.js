// Importing all external resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index'); 
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

// Login route
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

// GET route for "Account"
router.get('/login', utilities.handleErrors(accountController.buildLogin));
// GET route for "Registration"
router.get('/register', utilities.handleErrors(accountController.buildRegister));
// Registration route using POST
router.post('/register', utilities.handleErrors(accountController.registerAccount));


// Export router
module.exports = router;