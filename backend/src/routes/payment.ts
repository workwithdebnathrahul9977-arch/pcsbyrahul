import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all payments (with filters)
router.get('/', async (req, res) => {
  try {
    const statusFilter = req.query.status as string;
    
    let whereClause = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause = { status: statusFilter };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: { 
        user: true,
        enrollment: {
          include: {
            batch: {
              include: { course: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new payment (due or paid)
router.post('/', async (req, res) => {
  const { userId, enrollmentId, amount, month, status } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: { 
        userId, 
        enrollmentId,
        amount: parseFloat(amount), 
        month, 
        status 
      },
      include: {
        user: true,
        enrollment: { include: { batch: { include: { course: true } } } }
      }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update payment status (Mark as PAID)
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'PAID'
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.payment.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

export default router;
