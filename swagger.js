const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'EduSync API',
    description: "API for managing a school's student information system. It allows authenticated staff to manage student records, courses, and enrollments."
  },
  host: 'cse341-final-project-wddi.onrender.com', // Replace with your Render host
  schemes: ['https'],
  securityDefinitions: {
    api_key: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header'
    }
  }
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);