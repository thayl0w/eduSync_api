const router = require('express').Router();

// Swagger home route
router.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send(`
    <h1>Welcome to the EduSync API</h1>
    <p>Use the following endpoints to access the API:</p>
    <ul>
      <li><a href="/api-docs">API Documentation (Swagger)</a></li>
      <li><a href="/students">/students</a></li>
      <li><a href="/courses">/courses</a></li>
    </ul>
  `);
});

router.use('/students', require('./students'));
router.use('/courses', require('./courses'));

module.exports = router;