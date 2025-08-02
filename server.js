const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Trust proxy to detect https on Render
app.set('trust proxy', true);

// CORS headers to allow browser access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Correct Swagger UI setup (serve first, then setup)
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const swaggerCopy = JSON.parse(JSON.stringify(swaggerDocument));
  swaggerCopy.host = req.headers.host;
  swaggerCopy.schemes = [req.protocol]; // Will return "https" on Render
  swaggerUi.setup(swaggerCopy)(req, res, next);
});

// Routes
app.use('/', require('./routes'));

// MongoDB init and server listen
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and EduSync API is running on port ${port}`);
    });
  }
});