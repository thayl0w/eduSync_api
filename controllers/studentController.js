const { ObjectId } = require('mongodb');
const db = require('../config/db');

const students = db.getDb().collection('students');

// POST: Add new student
const createStudent = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ message: 'Name, email, and age are required.' });
    }

    const result = await students.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT: Update student by ID
const updateStudent = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const update = { $set: req.body };

    const result = await students.updateOne({ _id: studentId }, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createStudent,
  updateStudent
};
