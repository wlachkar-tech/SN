const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create course (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, name, description, credits } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: 'Code and name are required' });
    }

    const result = await db.runAsync(
      'INSERT INTO courses (code, name, description, credits) VALUES (?, ?, ?, ?)',
      [code, name, description, credits || 3]
    );

    res.status(201).json({ 
      message: 'Course created',
      courseId: result.lastID 
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Course code already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await db.allAsync('SELECT * FROM courses ORDER BY code');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await db.getAsync('SELECT * FROM courses WHERE id = ?', [req.params.id]);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, credits } = req.body;

    await db.runAsync(
      'UPDATE courses SET name = ?, description = ?, credits = ? WHERE id = ?',
      [name, description, credits, req.params.id]
    );

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.runAsync('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
