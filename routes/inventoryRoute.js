// routes/inventoryRoute.js
const express = require('express');
const router = express.Router();
const { validateInventoryData } = require('../utilities/inventory-validation');

// Route to get inventory
router.get('/', (req, res) => {
  // Logic to fetch and return inventory data
  res.send('Inventory data fetched successfully');
});

// Route to add new inventory
router.post('/add-inventory', (req, res) => {
  const data = req.body;
  const isValid = validateInventoryData(data);
  if (isValid) {
    // Logic to add new inventory item
    res.send('Inventory item added successfully');
  } else {
    res.status(400).send('Invalid inventory data');
  }
});

module.exports = router;
