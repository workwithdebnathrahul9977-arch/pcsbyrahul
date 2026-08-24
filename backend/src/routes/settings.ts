import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

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
