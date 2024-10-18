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
          // Handle vehicle not found
          return res.status(404).render("errors/error", { message: "Vehicle not found" });
      }

      // Navigation (Optional) - depending on your project requirements
      let nav = await utilities.getNav();

      // Render the vehicle detail page
      res.render("./inventory/vehicle", {
          title: `${data.inv_make} ${data.inv_model} ${data.inv_year}`,
          nav,
          vehicle: data
      });
  } catch (error) {
      next(error);  // Pass error to middleware
  }
};

// Controller to trigger a 500 error
invCont.triggerError = (req, res, next) => {
  // Intentionally cause an error
  const error = new Error('This is an intentional 500 error.');
  error.status = 500;
  next(error); // Pass the error to the error handling middleware
};


module.exports = invCont
