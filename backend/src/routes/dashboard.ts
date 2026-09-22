import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const [
      totalStudents,
      pendingAdmissions,
      approvedAdmissions,
      rejectedAdmissions,
      totalAdmissions,
      activeBatches,
      totalClasses,
      totalSubjects,
      totalCourses,
      feeCollectedObj,
      recentAdmissions,
      todayAdmissions,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT', enrollments: { some: {} } } }),
      prisma.admissionRequest.count({ where: { status: 'PENDING' } }),
      prisma.admissionRequest.count({ where: { status: 'APPROVED' } }),
      prisma.admissionRequest.count({ where: { status: 'REJECTED' } }),
      prisma.admissionRequest.count(),
      prisma.batch.count(),
      prisma.academicClass.count(),
      prisma.academicSubject.count(),
      prisma.course.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.admissionRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      prisma.admissionRequest.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
    ]);

    // Admission status breakdown for chart
    const admissionBreakdown = [
      { label: 'Pending', count: pendingAdmissions, color: '#f59e0b' },
      { label: 'Approved', count: approvedAdmissions, color: '#10b981' },
      { label: 'Rejected', count: rejectedAdmissions, color: '#ef4444' },
    ];

    res.json({
      stats: {
        totalStudents,
        newAdmissions: pendingAdmissions,
        approvedAdmissions,
        feeCollected: feeCollectedObj._sum.amount || 0,
        activeBatches,
        totalClasses,
        totalSubjects,
        totalCourses,
        totalAdmissions,
        todayAdmissions,
      },
      admissionBreakdown,
      recentAdmissions
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
