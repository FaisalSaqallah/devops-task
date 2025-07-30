const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Middleware: تحقق من صحة التوكن
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // بنضيف معلومات المستخدم للـ request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Middleware: يسمح فقط للـ Admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

// Middleware: يسمح لصاحب المشروع أو Admin
async function isOwnerOrAdmin(req, res, next) {
  const user = req.user;
  const projectId = parseInt(req.params.id);

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId === user.id || user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin,
};