import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create category
router.post('/', async (req, res) => {
  const { name, imageUrl } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name, imageUrl }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category. Note that category names must be unique.' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
