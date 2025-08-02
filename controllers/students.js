const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation function for student data
const validateStudent = (data) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'birthDate', 'gender', 'country', 'enrolledCourse'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return { valid: false, message: `Field '${field}' is required.` };
        }
    }
    return { valid: true };
};

const getAllStudents = async (req, res) => {
    // #swagger.tags = ['Students']
    // #swagger.summary = 'Get all students'
    // #swagger.description = 'Retrieves a list of all students from the database.'
    try {
        const result = await mongodb.getDatabase().db('edusync_api').collection('students').find();
        const students = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'An internal server error occurred while fetching students.' });
    }
};

const getStudentById = async (req, res) => {
    // #swagger.tags = ['Students']
    // #swagger.summary = 'Get a single student by ID'
    // #swagger.description = 'Retrieves a single student based on their unique MongoDB document ID.'
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format.' });
    }
    const studentId = new ObjectId(req.params.id);
    try {
        const result = await mongodb.getDatabase().db('edusync_api').collection('students').findOne({ _id: studentId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Student not found.' });
        }
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const createStudent = async (req, res) => {
    // #swagger.tags = ['Students']
    // #swagger.summary = 'Create a new student'
    // #swagger.description = 'Adds a new student to the database. All fields are required.'
    const validation = validateStudent(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        country: req.body.country,
        enrolledCourse: req.body.enrolledCourse
    };

    try {
        const response = await mongodb.getDatabase().db('edusync_api').collection('students').insertOne(student);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Student created successfully.', studentId: response.insertedId });
        } else {
            res.status(500).json({ error: 'An error occurred while creating the student.' });
        }
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const updateStudent = async (req, res) => {
    // #swagger.tags = ['Students']
    // #swagger.summary = 'Update an existing student'
    // #swagger.description = 'Updates the information for an existing student by their document ID.'
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format.' });
    }
    const studentId = new ObjectId(req.params.id);
    
    const validation = validateStudent(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const updatedStudent = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        country: req.body.country,
        enrolledCourse: req.body.enrolledCourse
    };

    try {
        // First check if the student exists
        const existingStudent = await mongodb.getDatabase().db('edusync_api').collection('students').findOne({ _id: studentId });
        if (!existingStudent) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const response = await mongodb.getDatabase().db('edusync_api').collection('students').replaceOne({ _id: studentId }, updatedStudent);
        
        // Return the updated student data regardless of whether changes were made
        const updatedStudentWithId = { ...updatedStudent, _id: studentId };
        const message = response.modifiedCount > 0 ? 'Student updated successfully.' : 'Student data unchanged (no modifications needed).';
        
        res.status(200).json({ 
            message: message,
            student: updatedStudentWithId
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const deleteStudent = async (req, res) => {
    // #swagger.tags = ['Students']
    // #swagger.summary = 'Delete a student'
    // #swagger.description = 'Deletes a student from the database by their document ID.'
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format.' });
    }
    const studentId = new ObjectId(req.params.id);

    try {
        const response = await mongodb.getDatabase().db('edusync_api').collection('students').deleteOne({ _id: studentId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Student deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Student not found.' });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};