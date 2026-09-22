import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// GET fees (Receive, History, Due depending on filters)
router.get('/', async (req, res) => {
  try {
    const { status, studentId, batchId, search, start, end } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') where.status = status;
    if (studentId) where.userId = String(studentId);
    if (batchId) where.enrollment = { batchId: String(batchId) };

    if (start || end) {
      where.createdAt = {};
      if (start) where.createdAt.gte = new Date(String(start));
      if (end) where.createdAt.lte = new Date(String(end));
    }

    if (search) {
      where.user = {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { phone: { contains: String(search) } }
        ]
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, phone: true, photoUrl: true } },
        enrollment: {
          include: { batch: { select: { name: true, courseFee: true, admissionFee: true, tuitionFee: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET users with active enrollments (for receiving fee)
router.get('/students', async (req, res) => {
  try {
    const { search } = req.query;
    const where: any = { role: 'STUDENT', enrollments: { some: { status: 'ACTIVE' } } };
    
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { phone: { contains: String(search) } }
      ];
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, phone: true, photoUrl: true,
        enrollments: {
          where: { status: 'ACTIVE' },
          include: { batch: true }
        }
      },
      take: 20
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Receive/Collect Fee
router.post('/', async (req, res) => {
  const { userId, enrollmentId, amount, month, method, note } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: {
        userId,
        enrollmentId,
        amount: parseFloat(amount),
        month: month || null,
        method: method || 'CASH',
        note: note || null,
        status: 'PAID', // Directly paid if received here
      },
      include: {
        user: true,
        enrollment: { include: { batch: true } }
      }
    });
    res.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CANCEL payment
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: 'CANCELED', cancelledAt: new Date() }
    });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel payment' });
  }
});

export default router;
