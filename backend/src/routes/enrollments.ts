import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: true,
        batch: {
          include: {
            course: true
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Enroll a student manually
router.post('/', async (req, res) => {
  try {
    const { userId, batchId } = req.body;
    
    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_batchId: {
          userId,
          batchId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Student is already enrolled in this batch' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        batchId
      },
      include: {
        user: true,
        batch: {
          include: {
            course: true
          }
        }
      }
    });
    
    // If it's a one-time payment course, generate the initial due automatically
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { course: true }
    });

    if (batch?.course) {
      await prisma.payment.create({
        data: {
          userId,
          enrollmentId: enrollment.id,
          amount: batch.course.fee,
          status: 'PENDING',
          month: batch.course.paymentType === 'ONE_TIME' ? 'Full Course Fee' : new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
        }
      });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

// Change enrollment status (ACTIVE / INACTIVE)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: { status }
    });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enrollment.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

export default router;
