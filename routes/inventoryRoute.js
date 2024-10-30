const express = require("express")
const router = new express.Router()
const utilities = require('../utilities/index'); 
const invController = require("../controllers/invController")
const validateResult = require("../utilities/inventory-validation")


// Route to display views
router.get('/', invController.buildManagementView); 
router.get("/add-classification", invController.addClassificationView); 
router.get("/add-inventory", invController.addInventoryView); 
router.get("/type/:classificationId", invController.buildByClassificationId); 
router.get("/detail/:vehicleId", invController.buildVehicleDetail); 
router.get("/trigger-error: error", invController.triggerError); 

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Routes to handle form submissions
router.post(
  "/add-inventory",
  validateResult.inventoryRules(), 
  validateResult.inventoryData,    
  invController.addInventory       
);

router.post(
  "/add-classification",
  validateResult.classificationRules(), 
  validateResult.classificationData,    
  invController.addClassification       
);

// Route to edit an inventory item by id
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView)); // Define the controller function

router.post("/update/", utilities.handleErrors(invController.updateInventory))

module.exports = router;