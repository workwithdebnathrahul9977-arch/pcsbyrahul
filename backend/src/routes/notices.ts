import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single notice
router.get('/:id', async (req, res) => {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: req.params.id }
    });
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create notice
router.post('/', async (req, res) => {
  const { title, content, target } = req.body;
  try {
    const notice = await prisma.notice.create({
      data: { title, content, target: target || 'ALL' }
    });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Delete notice
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

export default router;
