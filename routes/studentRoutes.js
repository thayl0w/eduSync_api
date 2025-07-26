const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// POST route
router.post('/', studentController.createStudent);

// PUT route
router.put('/:id', studentController.updateStudent);

module.exports = router;
