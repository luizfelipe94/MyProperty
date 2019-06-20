const propertyController = require('../controllers/property.controller');

module.exports = route => {
    route.get('/properties', propertyController.getProperties );
}