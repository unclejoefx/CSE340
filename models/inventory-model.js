const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
async function addClassification(classification_name) {
  const sql = 'INSERT INTO public.classification (classification_name) VALUE ($1)';
  await pool.query(sql, [classification_name]);
}


/* ***************************
 *  Get all inventory items and classification_name 
    by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      if (data.rows.length == 0 ) {
        throw new Error('Nothing is found in this page try another ID'); // throw error if no vehicle found
    }
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  // Vehicle inventory
async function getVehicleId(vehicleId) {
  try {
      const data = await pool.query(
          `SELECT * FROM public.inventory WHERE inv_id = $1`,
          [vehicleId]
      );
      if (data.rows.length == 0 ) {
          throw new Error('No vehicle found with this ID'); // error when no is vehicle found
      }
      return data.rows[0];  // Return the first row
  } catch (error) {
      throw new Error("Database query failed");
  }
}

async function getInventoryItems() {
  const sql = 'SELECT * FROM public.inventory ORDER BY inv_make;';
  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error('Error fetching inventory items: ', error);
    throw new Error('Failed to fetch inventory items');
  }
}

/* ***************************
*  Add a new inventory item
* ************************** */
async function addInventoryItem(
  inv_make, 
  inv_model, 
  inv_year, 
  inv_price, 
  inv_miles, 
  classification_id, 
  inv_color, 
  inv_description, 
  inv_image, 
  inv_thumbnail
) {
  const sql = `
    INSERT INTO public.inventory (
    inv_make, 
    inv_model, 
    inv_year, 
    inv_price, 
    inv_miles, 
    classification_id, 
    inv_color, 
    inv_description, 
    inv_image, 
    inv_thumbnail) 
    VALUES (
    $1, 
    $2, 
    $3, 
    $4, 
    $5, 
    $6, 
    $7, 
    $8, 
    $9, 
    $10)
    RETURNING inv_id;`; // Returning the inserted item ID (optional)

  try {
    const result = await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_price, inv_miles, 
      classification_id, inv_color, inv_description, inv_image, inv_thumbnail
    ]);

    // Returning the newly inserted inventory ID or other useful information
    return result.rows[0].inv_id;
  } catch (error) {
    console.error("Error adding inventory item: ", error);
    throw new Error("Failed to add inventory item");
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory (
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
  
  // model exports
  module.exports = {
    getInventoryItems,
    getClassifications,
    addClassification,
    getInventoryByClassificationId,
    getVehicleId,
    addInventoryItem,
    updateInventory
  };