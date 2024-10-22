const {check} = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory by vehicle view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
      const vehicleId = req.params.vehicleId;
      const data = await invModel.getVehicleId(vehicleId);
      
      if (!data) {
          return res.status(404).render("errors/error", { message: "Vehicle not found" }); // return vehicle not found
      }

      let nav = await utilities.getNav();

      // vehicle detail page
      res.render("./inventory/vehicle", {
          title: `${data.inv_make} ${data.inv_model} ${data.inv_year}`,
          nav,
          vehicle: data
      });
  } catch (error) {
      next(error); 
  }
};


// delivery management view
invCont.buildManagementView = async function (req, res, next) {
  try {
      // Generate the navigation (if required)
      let nav = await utilities.getNav();
      res.render("./inventory/management", {
          title: "Inventory Management",
          nav,
          flashMessage: req.flash('info')
      })
  } catch (error) {
      next(error);
  }
}

/* ***************************
 *  Add classification view
 * ************************** */
invCont.addClassificationView = async function (req, res, next) {
  try {
      let nav = await utilities.getNav();
      res.render("inventory/add-classification", {
          title: "Add Classification",
          nav,
          flashMessage: req.flash('info') 
      })
  } catch (error) {
      next(error); // error to middleware
  }
}

/* ***************************
 *  Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const errors = check(req);
  if (!errors.isEmpty()) {
      return res.render("inventory/add-classification", {errors: errors.array() });
  }

  try {
      const {classification_name} = req.body;
      await invModel.addClassification(classification_name);
      req.flash("info", "Classification added successfully!");
      res.redirect("/inv");
  } catch (error) {
      res.render("inventory/add-classification", {
          errors: [{msg: "Error adding classification."}],
      });
  }
};


/* ***************************
 *  Add Inventory View
 * ************************** */
invCont.addInventoryView = async function (req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: [],
      inv_make: "",
      inv_model: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
*  Add Inventory
* ************************** */
invCont.addInventory = async function (req, res, next) {
  const errors = validationResult(req);
  const { inv_make, inv_model, classification_id } = req.body;

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(classification_id);
    let nav = await utilities.getNav();
    return res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: errors.array(),
      inv_make,
      inv_model,
    });
  }

  try {
    await invModel.addInventoryItem(inv_make, inv_model, classification_id);
    req.flash("info", "Inventory item added successfully!");
    res.redirect("/inv");
  } catch (error) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: [{ msg: "Error adding inventory item." }],
      inv_make,
      inv_model,
      });
  }
};


// trigger error
invCont.triggerError = (req, res, next) => {
  const error = new Error('This is an intentional 500 error.');
  error.status = 500;
  next(error); // Pass the error to the error handling middleware
};


module.exports = invCont
