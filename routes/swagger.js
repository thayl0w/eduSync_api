const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const options = {
    swaggerOptions: {
        withCredentials: true // <-- allows sending cookies cross-origin
    }
};

// Use serve + setup together
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

module.exports = router;