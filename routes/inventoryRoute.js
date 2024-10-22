const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const {check} = require("express-validator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.buildVehicleDetail);
router.get("/trigger-error: error", invController.triggerError)

// Management view route
router.get('/', invController.buildManagementView);

// classification view route
router.get("/add-classification", invController.addClassificationView)

//  inventory view route
router.get('/add-inventory', invController.addInventoryView);

// classification process route with server-side validation
router.post("/add-classification", [
    check("classification_name").isAlphanumeric().withMessage("Classification name must not contain special characters or spaces")
], invController.addClassification);

// inventory process route with validation
router.post('/add-inventory', [
    check('inv_make').notEmpty().withMessage('Make is required'),
    check('inv_model').notEmpty().withMessage('Model is required'),
    check('classification_id').notEmpty().withMessage('Classification is required')
], invController.addInventory);

module.exports = router;