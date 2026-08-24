import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all sliders (public/admin)
router.get('/', async (req, res) => {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ error: 'Failed to fetch sliders' });
  }
});

// Create a new slider (admin)
router.post('/', async (req, res) => {
  try {
    const { imageUrl, link } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const slider = await prisma.slider.create({
      data: {
        imageUrl,
        link: link || null,
        isActive: true,
      }
    });

    res.json(slider);
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ error: 'Failed to create slider' });
  }
});

// Delete a slider (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.slider.delete({
      where: { id }
    });
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ error: 'Failed to delete slider' });
  }
});

export default router;
