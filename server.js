/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/



/* ***********************
 * Require Statements
 *************************/
const session = require("express-session"); // Single declaration of session
const pool = require('./database/');
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/index");
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser"); // import the body-parser
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 * ************************/
// Session management
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET, // Ensure this is set in .env
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Parse cookies before checking JWT
app.use(cookieParser());

// JWT and flash message middleware
app.use(utilities.checkJWTToken);
app.use(require('connect-flash')());

// Message setup middleware
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Flash middleware to pass messages to every response
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

// Middleware for parsing incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route - Unit 3, activity
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute); // Ensure inventoryRoute exports a router

app.use("/trigger-error", utilities.handleErrors(baseController.triggerError));

// Account route
app.use("/account", accountRoute); // Ensure accountRoute exports a router

// File Not Found Route - must be last in the list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Intentional Error Handler
 * Place after all other middleware
 *************************/
app.use((error, req, res, next) => {
  console.error(error.stack); // Log the error stack for debugging.
  res.status(error.status || 500); // Set the 500 for internal errors
  res.render('errors/error', { // Render the error view
    message // Pass the error message to the view
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
