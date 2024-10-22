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

/* ***************************
*  Add a new inventory item
* ************************** */
async function addInventoryItem(make, model, classification_id) {
const sql = 'INSERT INTO public.inventory (inv_make, inv_model, classification_id) VALUES ($1, $2, $3)';
try {
    await pool.query(sql, [make, model, classification_id]);
} catch (error) {
    console.error("Error adding inventory item: ", error);
    throw new Error("Failed to add inventory item");
}
}

  
  // model exports
  module.exports = {getClassifications, addClassification, getInventoryByClassificationId, getVehicleId, addInventoryItem};