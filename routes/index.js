const router = require('express').Router();

router.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the EduSync API</h1>
    <p>Use the following endpoints to access the API:</p>
    <ul>
      <li><a href="/students">Students</a></li>
    </ul>
  `);
});

router.use('/students', require('./students'));

module.exports = router;
// This file sets up the main route for the EduSync API, responding with a welcome message