import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all active videos for frontend
router.get('/public', async (req, res) => {
  try {
    const videos = await prisma.campusVideo.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get all videos for admin
router.get('/', async (req, res) => {
  try {
    const videos = await prisma.campusVideo.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Reorder videos
router.put('/reorder', async (req, res) => {
  try {
    const { videoIds } = req.body;
    if (!Array.isArray(videoIds)) return res.status(400).json({ error: 'videoIds array required' });

    await prisma.$transaction(
      videoIds.map((id, index) => 
        prisma.campusVideo.update({
          where: { id },
          data: { order: index }
        })
      )
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder videos' });
  }
});

// Create video
router.post('/', async (req, res) => {
  try {
    const { title, youtubeUrl, thumbnailUrl, isActive } = req.body;
    const video = await prisma.campusVideo.create({
      data: { title, youtubeUrl, thumbnailUrl, isActive: isActive ?? true }
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, youtubeUrl, thumbnailUrl, isActive } = req.body;
    const video = await prisma.campusVideo.update({
      where: { id },
      data: { title, youtubeUrl, thumbnailUrl, isActive }
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video
router.delete('/:id', async (req, res) => {
  try {
    await prisma.campusVideo.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;
