const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create student profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { rollNumber, dateOfBirth, phone, address, city, state, zipCode, enrollmentDate } = req.body;
    const userId = req.userId;

    const result = await db.runAsync(
      `INSERT INTO students (userId, rollNumber, dateOfBirth, phone, address, city, state, zipCode, enrollmentDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, rollNumber, dateOfBirth, phone, address, city, state, zipCode, enrollmentDate || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json({ 
      message: 'Student profile created',
      studentId: result.lastID 
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Roll number already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get student by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await db.getAsync(
      'SELECT s.*, u.email, u.name FROM students s JOIN users u ON s.userId = u.id WHERE s.id = ?',
      [req.params.id]
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const students = await db.allAsync(
      'SELECT s.*, u.email, u.name FROM students s JOIN users u ON s.userId = u.id'
    );

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { dateOfBirth, phone, address, city, state, zipCode } = req.body;
    const studentId = req.params.id;

    // Check if student belongs to current user (unless admin)
    if (req.userRole !== 'admin') {
      const student = await db.getAsync('SELECT userId FROM students WHERE id = ?', [studentId]);
      if (student.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    await db.runAsync(
      `UPDATE students SET dateOfBirth = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ? 
       WHERE id = ?`,
      [dateOfBirth, phone, address, city, state, zipCode, studentId]
    );

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.runAsync('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
