// const express = require('express');
// const router = express.Router();

const router = require('express').Router();

const enrollmentsController = require('../controllers/enrollments');
const { isAuthenticated } = require('../middleware/authenticated');

// GET all enrollments
router.get('/', enrollmentsController.getAllEnrollments);

// GET a single enrollment by ID
router.get('/:id', enrollmentsController.getEnrollmentById);

// POST a new enrollment (Protected)
router.post('/', isAuthenticated, enrollmentsController.createEnrollment);

// PUT (update) an enrollment by ID (Protected)
router.put('/:id', isAuthenticated, enrollmentsController.updateEnrollment);

// DELETE an enrollment by ID (Protected)
router.delete('/:id', isAuthenticated, enrollmentsController.deleteEnrollment);

module.exports = router;