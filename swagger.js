const swaggerAutogen = require('swagger-autogen')();

// Detect environment: Render or local
const isRender = !!process.env.RENDER; // Render sets this automatically
const renderUrl = process.env.RENDER_EXTERNAL_URL || 'https://edusync-api-7p52.onrender.com';

let host, schemes;

if (isRender) {
  // Use Render URL when deployed
  const { hostname, protocol } = new URL(renderUrl);
  host = hostname;              // edusync-api-7p52.onrender.com
  schemes = [protocol.replace(':', '')]; // ['https']
} else {
  // Local development
  host = `localhost:${process.env.PORT || 3000}`;
  schemes = ['http'];
}

const doc = {
  info: {
    title: 'EduSync API',
    description: "API for managing a school's student information system. It allows authenticated staff to manage student records, courses, and enrollments.",
    version: '1.0.0'
  },
  host,
  schemes,
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