const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome to the EduSync API');
});

router.use('/students', require('./students'));

module.exports = router;
// This file sets up the main route for the EduSync API, responding with a welcome message