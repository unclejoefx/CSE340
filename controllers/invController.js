//const {check} = require("express-validator")
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
        next(error);  
    }
};

invCont.buildManagementView = async function (req, res,next) {
    let nav = await utilities.getNav()

    const classificationSelect = await utilities.buildClassificationList();

    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect,
    })
}

/* ***************************
 *  Add classification view
 * ************************** */
invCont.addClassificationView = async function (req, res, next) {
    try {
        // Generate the navigation (if required)
        let nav = await utilities.getNav();

        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            classification_name: null,
            flashMessage: req.flash('info')
        })
    } catch (error) {
        next(error); 
    }
}

/* ***************************
 *  Add Inventory View
 * ************************** */
invCont.addInventoryView = async function (req, res, next) {
    try {
      // Fetch the classification list from the database
      const classificationList = await utilities.buildClassificationList();

      // Fetch the existing inventory data (optional, if you want to show existing items or pre-fill)
      //const inventoryList = await invModel.getInventoryItems(); // Assume this function exists

      // Get navigation
      let nav = await utilities.getNav();

      // Render the view and pass inventory data to the view
      res.render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav,
        classificationList,  // Render the classifications for selection
        //inventoryList,        // If you want to display existing inventory
        errors: [],           // Error handling placeholder
        inv_make: "",         // Empty form fields
        inv_model: "",
        inv_year: "",
        inv_description: "",
        inv_image: "",
        inv_thumbnail: "",
        inv_price: "",
        inv_miles: "",
        inv_color: "",
      });
    } catch (error) {
      next(error);
    }
};


/* ***************************
 *  Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next){
    try {
        const { classification_name } = req.body;
        await invModel.addClassification(classification_name);  // Add to the model
        req.flash("info", "Classification added successfully!");  // Flash message for success
        res.redirect("/inv");
    } catch (error) {
        let nav = await utilities.getNav();  // Get navigation again in case of error
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: [{ msg: "Error adding classification." }],
            classification_name: req.body.classification_name || ''  // Retain input on error
        });
    }
};


/* ***************************
 *  Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    try {
        const {inv_make, inv_model, inv_year, inv_price, inv_miles, classification_id, inv_color, inv_description, inv_image, inv_thumbnail} = req.body;

        // Add the new inventory item to the database
        await invModel.addInventoryItem(inv_make, inv_model, inv_year, inv_price, inv_miles, classification_id, inv_color, inv_description, inv_image, inv_thumbnail);

        // Flash message for successful addition and redirect
        req.flash("info", "Inventory item added successfully!");
        res.redirect("/inv");
    } catch (error) {
        
        let nav = await utilities.getNav();
        
        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            errors: [{ msg: "Error adding inventory item. Please try again later." }],  // Display a custom error message
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            inv_color,
            inv_description,
            inv_image,
            inv_thumbnail,
            classificationList: req.body.addInventory || " "
        });
    }
};


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
}

// Controller to trigger a 500 error
invCont.triggerError = (req, res, next) => {
    const error = new Error('This is an intentional 500 error.');
    error.status = 500;
    next(error);
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


module.exports = invCont