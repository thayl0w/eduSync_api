const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('EduSync API is running...');
});

module.exports = router;
