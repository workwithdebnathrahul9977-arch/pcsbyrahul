import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({ include: { batches: true } });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, imageUrl, fee } = req.body;
  try {
    const course = await prisma.course.create({
      data: { title, description, imageUrl, fee: parseFloat(fee) }
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
