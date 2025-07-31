const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation function for student data
const validateStudent = (data) => {
    const requiredFields = [
        'studentIdNumber', 'firstName', 'lastName', 'dateOfBirth', 
        'gradeLevel', 'guardianName', 'guardianContactPhone'
    ];
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
    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Student document ID',
            required: true,
            type: 'string'
    } */
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
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Student data',
            required: true,
            schema: {
                studentIdNumber: 'S123456',
                firstName: 'Taurai',
                lastName: 'Mutema',
                dateOfBirth: '2005-08-15',
                gradeLevel: 10,
                guardianName: 'Tarisai Mutema',
                guardianContactPhone: '555-123-4567',
                guardianContactEmail: 'tarisai.mutema@zimasset.zw'
            }
    } */
    const validation = validateStudent(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const student = {
        studentIdNumber: req.body.studentIdNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gradeLevel: req.body.gradeLevel,
        guardianName: req.body.guardianName,
        guardianContactPhone: req.body.guardianContactPhone,
        guardianContactEmail: req.body.guardianContactEmail || '' // Optional field
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
    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Student document ID',
            required: true,
            type: 'string'
    } */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Student data to update',
            required: true,
            schema: {
                studentIdNumber: 'S123456',
                firstName: 'Taurai',
                lastName: 'Mutema',
                dateOfBirth: '2005-08-15',
                gradeLevel: 11,
                guardianName: 'Tarisai Mutema',
                guardianContactPhone: '555-987-6543',
                guardianContactEmail: 'tarisai.mutema@zimasset.zw'
            }
    } */
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format.' });
    }
    const studentId = new ObjectId(req.params.id);
    
    const validation = validateStudent(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const updatedStudent = {
        studentIdNumber: req.body.studentIdNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gradeLevel: req.body.gradeLevel,
        guardianName: req.body.guardianName,
        guardianContactPhone: req.body.guardianContactPhone,
        guardianContactEmail: req.body.guardianContactEmail || ''
    };

    try {
        const response = await mongodb.getDatabase().db('edusync_api').collection('students').replaceOne({ _id: studentId }, updatedStudent);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Student not found or no changes made.' });
        }
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const deleteStudent = async (req, res) => {
    // #swagger.tags = ['Students']
    // #swagger.summary = 'Delete a student'
    // #swagger.description = 'Deletes a student from the database by their document ID.'
    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Student document ID',
            required: true,
            type: 'string'
    } */
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