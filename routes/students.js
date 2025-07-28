const express = require('express');
const router = express.Router();

const studentsController = require('../controllers/students');
// next week let's add the aurhentication, I'll comment out the authentication middleware for now
// const { isAuthenticated } = require('../middleware/authenticated');

router.get('/', studentsController.getAllStudents);
// Add the remaining routes for students
// ...






module.exports = router;
// This file sets up the routes for the students collection, allowing for CRUD operations