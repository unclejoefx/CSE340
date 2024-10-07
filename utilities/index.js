const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

// Function to build HTML for vehicle details page
Util.buildVehicleHTML = function(vehicle) {
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(vehicle.price);

    const mileage = new Intl.NumberFormat('en-US').format(vehicle.mileage);

    let vehicleHTML = `<div class="vehicle-detail">
                        <h1>${vehicle.make} ${vehicle.model}</h1>
                        <img src="${vehicle.image_full}" alt="Image of ${vehicle.make} ${vehicle.model}">
                        <p><strong>Make:</strong> ${vehicle.make}</p>
                        <p><strong>Model:</strong> ${vehicle.model}</p>
                        <p><strong>Year:</strong> ${vehicle.year}</p>
                        <p><strong>Price:</strong> ${price}</p>
                        <p><strong>Mileage:</strong> ${mileage} miles</p>
                        <p>${vehicle.description}</p>
                       </div>`;

    return vehicleHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util