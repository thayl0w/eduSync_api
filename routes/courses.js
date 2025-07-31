const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courses');
// const { isAuthenticated } = require('../middleware/authenticated'); // For future implementation

// GET all courses
router.get('/', coursesController.getAllCourses);

// GET a single course by ID
router.get('/:id', coursesController.getCourseById);

// POST a new course
router.post('/', coursesController.createCourse);

// PUT (update) a course by ID
router.put('/:id', coursesController.updateCourse);

// DELETE a course by ID
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
// This file sets up the routes for the courses collection, allowing for CRUD operations