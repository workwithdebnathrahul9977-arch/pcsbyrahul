import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

// GET all success stories
router.get('/', async (req, res) => {
  try {
    const stories = await prisma.successStory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(stories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single success story
router.get('/:id', async (req, res) => {
  try {
    const story = await prisma.successStory.findUnique({
      where: { id: req.params.id }
    });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new success story
router.post('/', async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const story = await prisma.successStory.create({
      data: { title, content, imageUrl }
    });
    res.status(201).json(story);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update success story
router.put('/:id', async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const story = await prisma.successStory.update({
      where: { id: req.params.id },
      data: { title, content, imageUrl }
    });
    res.json(story);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE success story
router.delete('/:id', async (req, res) => {
  try {
    await prisma.successStory.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
