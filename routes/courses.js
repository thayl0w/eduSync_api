// const express = require('express');
// const router = express.Router();

const router = require('express').Router();

const coursesController = require('../controllers/courses');
const { isAuthenticated } = require('../middleware/authenticated');

// GET all courses
router.get('/', coursesController.getAllCourses);

// GET a single course by ID
router.get('/:id', coursesController.getCourseById);

// POST a new course
router.post('/', isAuthenticated, coursesController.createCourse);

// PUT (update) a course by ID
router.put('/:id', isAuthenticated, coursesController.updateCourse);

// DELETE a course by ID
router.delete('/:id', isAuthenticated, coursesController.deleteCourse);

module.exports = router;
// This file sets up the routes for the courses collection, allowing for CRUD operations