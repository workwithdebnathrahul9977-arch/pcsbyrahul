import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create testimonial
router.post('/', async (req, res) => {
  const { name, school, opinion, imageUrl } = req.body;
  try {
    const testimonial = await prisma.testimonial.create({
      data: { name, school, opinion, imageUrl }
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
