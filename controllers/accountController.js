const utilities = require('../utilities/index'); 
const accountModel = require('../models/account-model') // Import the account model


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        message: req.flash('error') || null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

const processLogin = (req, res) => {
    const { account_email, account_password } = req.body;
  
    // Login check
    if (account_email === 'test@example.com' && account_password === 'password123') {
      req.flash('success', 'Login successful!');
      res.redirect('/dashboard');  // Redirect to dashboard
    } else {
      req.flash('error', 'Invalid email or password.');
      res.redirect('/account/login');  // Back to login if authentication fails
    }
};

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulation, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}

module.exports = { buildLogin, processLogin, buildRegister, registerAccount }