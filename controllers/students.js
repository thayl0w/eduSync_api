const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Create a get all of the students(GET), get a student by ID(GET), create a student(POST), update a student(PUT), and delete a student(DELETE) routes

// This week5 we just need to create a two collections, which are students and courses
// I add the get all of the students(GET) route and add the other routes

const getAllStudents = async (req, res) => {
    //#Swagger.tags = ['Students'];
    try {
        const result = await mongodb.getDatabase().db('edusync_api').collection('students').find();
        const students = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'An error occurred while fetching students.' });
    }
};


// Add the remaining routes for students
// ...

module.exports = {
    getAllStudents,
    // getStudentsById,
    // createStudent,
    // updateStudent,
    // deleteStudent
};