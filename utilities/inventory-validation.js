// utilities/inventory-validation.js
function validateInventoryData(data) {
    // Your validation logic here
    const utilities = require("../utilities/index")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
    ]}
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.classificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inv/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name
      })
      return
    }
    next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid make."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid model."),

    body("inv_year")
      .trim()
      .isInt({ min: 1886, max: new Date().getFullYear() })  // Validates that the year is a number and within range
      .withMessage("Please provide a valid year."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid description."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid image URL."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid thumbnail URL."),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide a valid mileage."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid color."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.inventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() // Assume this fetches the classification options
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: errors.array(),  // Send error messages to the view
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color
    })
    return
  }
  next()
}


/* ******************************
 * Check data and return errors or continue for the edit view
 * ***************************** */
validate.updateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() // Assume this fetches the classification options
    res.render("inventory/edit-inventory", {
      title: "Edit View",
      nav,
      classificationList,
      errors: errors.array(),  // Send error messages to the view
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color
    })
    return
  }
  next()
}


module.exports = validate
  }
  
  module.exports = {
    validateInventoryData,
  };
  