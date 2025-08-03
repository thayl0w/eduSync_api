const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation function for course data
const validateCourse = (data) => {
    const requiredFields = ['courseName', 'description', 'programLength', 'creditsRequired', 'deliveryMode', 'careerPath', 'isActive'];
    for (const field of requiredFields) {
        if (!data[field] && data[field] !== false) {
            return { valid: false, message: `Field '${field}' is required.` };
        }
    }
    return { valid: true };
};

const getAllCourses = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.summary = 'Get all courses'
    // #swagger.description = 'Retrieves a list of all courses from the database.'
    try {
        const result = await mongodb.getDatabase().db('edusync_api').collection('courses').find();
        const courses = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'An internal server error occurred while fetching courses.' });
    }
};

const getCourseById = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.summary = 'Get a single course by ID'
    // #swagger.description = 'Retrieves a single course based on its unique MongoDB document ID.'
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }
    const courseId = new ObjectId(req.params.id);
    try {
        const result = await mongodb.getDatabase().db('edusync_api').collection('courses').findOne({ _id: courseId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Course not found.' });
        }
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const createCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.summary = 'Create a new course'
    // #swagger.description = 'Adds a new course to the database. All fields are required.'
    const validation = validateCourse(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const course = {
        courseName: req.body.courseName,
        description: req.body.description,
        programLength: req.body.programLength,
        creditsRequired: req.body.creditsRequired,
        deliveryMode: req.body.deliveryMode,
        careerPath: req.body.careerPath,
        isActive: req.body.isActive
    };

    try {
        const response = await mongodb.getDatabase().db('edusync_api').collection('courses').insertOne(course);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Course created successfully.', courseId: response.insertedId });
        } else {
            res.status(500).json({ error: 'An error occurred while creating the course.' });
        }
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const updateCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.summary = 'Update an existing course'
    // #swagger.description = 'Updates the information for an existing course by its document ID.'
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }
    const courseId = new ObjectId(req.params.id);

    const validation = validateCourse(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const updatedCourse = {
        courseName: req.body.courseName,
        description: req.body.description,
        programLength: req.body.programLength,
        creditsRequired: req.body.creditsRequired,
        deliveryMode: req.body.deliveryMode,
        careerPath: req.body.careerPath,
        isActive: req.body.isActive
    };

    try {
        // First check if the course exists
        const existingCourse = await mongodb.getDatabase().db('edusync_api').collection('courses').findOne({ _id: courseId });
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const response = await mongodb.getDatabase().db('edusync_api').collection('courses').replaceOne({ _id: courseId }, updatedCourse);
        
        // Return the updated course data regardless of whether changes were made
        const updatedCourseWithId = { ...updatedCourse, _id: courseId };
        const message = response.modifiedCount > 0 ? 'Course updated successfully.' : 'Course data unchanged (no modifications needed).';
        
        res.status(200).json({ 
            message: message,
            course: updatedCourseWithId
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

const deleteCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.summary = 'Delete a course'
    // #swagger.description = 'Deletes a course from the database by its document ID.'
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }
    const courseId = new ObjectId(req.params.id);

    try {
        const response = await mongodb.getDatabase().db('edusync_api').collection('courses').deleteOne({ _id: courseId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Course deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Course not found.' });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
