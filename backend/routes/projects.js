const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken, isOwnerOrAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// POST /projects - إنشاء مشروع (مسجّل فقط)
router.post('/', verifyToken, async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: req.user.id,
      },
    });
    res.set('X-App-Check', 'vtask2901');
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /projects - عام
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.set('X-App-Check', 'vtask2901');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /projects/:id - فقط المالك أو admin
router.put('/:id', verifyToken, isOwnerOrAdmin, async (req, res) => {
  const projectId = parseInt(req.params.id);
  const { title, description } = req.body;

  try {
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { title, description },
    });
    res.set('X-App-Check', 'vtask2901');
    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /projects/:id - فقط المالك أو admin
router.delete('/:id', verifyToken, isOwnerOrAdmin, async (req, res) => {
  const projectId = parseInt(req.params.id);

  try {
    await prisma.project.delete({ where: { id: projectId } });
    res.set('X-App-Check', 'vtask2901');
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;