import { Router } from 'express';
import prisma from '../prismaClient';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Fetch user with enrollments and payments
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            batch: {
              include: {
                course: true
              }
            }
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          include: {
            enrollment: {
              include: {
                batch: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        },
        ExamResult: {
          include: {
            exam: {
              include: {
                batch: {
                  include: {
                    course: true
                  }
                }
              }
            }
          },
          orderBy: {
            exam: {
              date: 'desc'
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard' });
  }
});

export default router;
