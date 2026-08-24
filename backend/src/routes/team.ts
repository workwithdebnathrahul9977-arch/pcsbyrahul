import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, role, imageUrl, phone, facebook, instagram, whatsapp, twitter, linkedin, order, bio } = req.body;
  try {
    const member = await prisma.teamMember.create({
      data: { name, role, imageUrl, phone, facebook, instagram, whatsapp, twitter, linkedin, bio, order: parseInt(order) || 0 }
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, imageUrl, phone, facebook, instagram, whatsapp, twitter, linkedin, order, bio } = req.body;
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: { name, role, imageUrl, phone, facebook, instagram, whatsapp, twitter, linkedin, bio, order: parseInt(order) || 0 }
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.teamMember.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
