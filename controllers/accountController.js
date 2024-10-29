const utilities = require('../utilities/index'); 
const accountModel = require('../models/account-model') // Import the account model
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config() 

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

// Login form submission
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
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav();
    const { 
        account_firstname,
        account_lastname,
        account_email, 
        account_password    
    } = req.body

    // Password sorting
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash(
            "notice",
            "Sorry, there was an error processing the registration"
        )
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulation, you\'re registered ${account_firstname}. Please login.`
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

/* ****************************************
*  Process Login request
* *************************************** */
async function accountLogin(req, res, next) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if(process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true,  maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error("Access Forbidden")
    }
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function getAccountManagement(req, res, next) {
    try {
        let nav = await utilities.getNav(); 

        res.render("account/management", {
            title: "Account Management",
            nav,
        });
    } catch (error) {
        console.error("Error retrieving account management view:", error);
        next(error);
    }
}


module.exports = { buildLogin, processLogin, buildRegister, registerAccount, accountLogin, getAccountManagement}