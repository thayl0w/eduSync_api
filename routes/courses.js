const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courses');
// next week let's add the authentication, I'll comment out the authentication middleware for now
// const { isAuthenticated } = require('../middleware/authenticated');

router.get('/', coursesController.getAllCourses);
// Add the remaining routes for courses
// ...



module.exports = router;
// This file sets up the routes for the courses collection, allowing for CRUD operations