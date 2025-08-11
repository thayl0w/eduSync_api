// const express = require('express');
// const router = express.Router();

const router = require('express').Router();

const studentsController = require('../controllers/students');
const { isAuthenticated } = require('../middleware/authenticated');

// GET all students
router.get('/', studentsController.getAllStudents);

// GET a single student by ID
router.get('/:id', studentsController.getStudentById);

// POST a new student
router.post('/', isAuthenticated, studentsController.createStudent);

// PUT (update) a student by ID
router.put('/:id', isAuthenticated, studentsController.updateStudent);

// DELETE a student by ID
router.delete('/:id', isAuthenticated, studentsController.deleteStudent);

module.exports = router;
// This file sets up the routes for the students collection, allowing for CRUD operations