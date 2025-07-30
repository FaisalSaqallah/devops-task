const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken, isAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /users - Admin only
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.set('X-App-Check', 'vtask2901');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /users/:id - Update user (by self or admin)
router.put('/:id', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, role } = req.body;

  if (req.user.id !== userId && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Not allowed to update this user' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
    });
    res.set('X-App-Check', 'vtask2901');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /users/:id - Admin only
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.set('X-App-Check', 'vtask2901');
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;