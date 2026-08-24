import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all albums
router.get('/', async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Get single album
router.get('/:id', async (req, res) => {
  try {
    const album = await prisma.album.findUnique({
      where: { id: req.params.id }
    });
    if (!album) return res.status(404).json({ error: 'Album not found' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

// Create album
router.post('/', async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const newAlbum = await prisma.album.create({
      data: { title, content, images }
    });
    res.json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Update album
router.put('/:id', async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const updatedAlbum = await prisma.album.update({
      where: { id: req.params.id },
      data: { title, content, images }
    });
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// Delete album
router.delete('/:id', async (req, res) => {
  try {
    await prisma.album.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

export default router;
