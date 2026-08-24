import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

// Search results
router.get('/search', async (req, res) => {
  const { examId, userId } = req.query;
  try {
    const result = await prisma.examResult.findFirst({
      where: {
        examId: String(examId),
        userId: String(userId)
      },
      include: {
        exam: true,
        user: true
      }
    });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin adds a result
router.post('/', async (req, res) => {
  const { examId, userId, marks } = req.body;
  try {
    const result = await prisma.examResult.create({
      data: { examId, userId, marks: parseFloat(marks) }
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
