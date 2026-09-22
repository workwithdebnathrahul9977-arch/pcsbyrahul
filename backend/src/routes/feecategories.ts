import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all fee categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.feeCategory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create fee category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.feeCategory.create({
      data: { name }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fee category. Name might exist.' });
  }
});

// Update fee category
router.put('/:id', async (req, res) => {
  const { name, isActive } = req.body;
  try {
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (isActive !== undefined) data.isActive = isActive;
    
    const category = await prisma.feeCategory.update({
      where: { id: req.params.id },
      data
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fee category' });
  }
});

// Delete fee category
router.delete('/:id', async (req, res) => {
  try {
    await prisma.feeCategory.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fee category' });
  }
});

export default router;
