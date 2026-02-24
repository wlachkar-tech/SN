const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get student enrollments
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    // Check if user is the student or admin
    if (req.userRole !== 'admin') {
      const student = await db.getAsync('SELECT userId FROM students WHERE id = ?', [req.params.studentId]);
      if (student.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const enrollments = await db.allAsync(
      `SELECT e.*, c.code, c.name, c.description, c.credits 
       FROM enrollments e 
       JOIN courses c ON e.courseId = c.id 
       WHERE e.studentId = ?
       ORDER BY c.code`,
      [req.params.studentId]
    );

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll student in course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { studentId, courseId, enrollmentDate } = req.body;

    // Check if user is the student or admin
    if (req.userRole !== 'admin') {
      const student = await db.getAsync('SELECT userId FROM students WHERE id = ?', [studentId]);
      if (student.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const result = await db.runAsync(
      'INSERT INTO enrollments (studentId, courseId, enrollmentDate) VALUES (?, ?, ?)',
      [studentId, courseId, enrollmentDate || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json({ 
      message: 'Enrollment created',
      enrollmentId: result.lastID 
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Student already enrolled in this course' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update enrollment grade (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { grade } = req.body;

    await db.runAsync(
      'UPDATE enrollments SET grade = ? WHERE id = ?',
      [grade, req.params.id]
    );

    res.json({ message: 'Grade updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove enrollment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const enrollment = await db.getAsync('SELECT e.*, s.userId FROM enrollments e JOIN students s ON e.studentId = s.id WHERE e.id = ?', [req.params.id]);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check authorization
    if (req.userRole !== 'admin' && enrollment.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db.runAsync('DELETE FROM enrollments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Enrollment removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
