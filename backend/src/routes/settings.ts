import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array of {key, value} to object {key: value}
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as any);
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key }
    });
    res.json({ value: setting ? setting.value : null });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:key', async (req, res) => {
  const { value } = req.body;
  try {
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value: String(value) },
      create: { key: req.params.key, value: String(value) }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
