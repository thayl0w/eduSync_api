const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Create a get all of the courses(GET), get a course by ID(GET), create a course(POST), update a course(PUT), and delete a course(DELETE) routes
// This week5 we just need to create a two collections, which are students and courses
// I add the get all of the courses(GET) route and add the other routes

const getAllCourses = async (req, res) => {
    //#Swagger.tags = ['Courses'];
    try {
        const result = await mongodb.getDatabase().db('edusync_api').collection('courses').find();
        const courses = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'An error occurred while fetching courses.' });
    }
};

// Add the remaining routes for courses
// ...








module.exports = {
    getAllCourses,
    // getCourseById,
    // createCourse,
    // updateCourse,
    // deleteCourse
};