import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient';

const router = express.Router();

// GET all staff/admin accounts (not students)
router.get('/', async (req, res) => {
  try {
    const accounts = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'STAFF', 'TEACHER'] } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    });
    res.json(accounts);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all users (students included, for searching)
router.get('/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE new account
router.post('/', async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone, role: role || 'STAFF' },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE account (name, phone, role, optionally reset password)
router.put('/:id', async (req, res) => {
  const { name, phone, role, password } = req.body;
  try {
    const updateData: any = { name, phone, role };
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE account
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
