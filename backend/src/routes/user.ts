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
        attendanceRecords: {
          orderBy: { createdAt: 'desc' },
          include: { session: true }
        },
        ExamResult: {
          include: {
            exam: true
          },
          orderBy: { id: 'desc' },
          take: 20,
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard' });
  }
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const {
      name,
      dob,
      bloodGroup,
      presentAddress,
      permanentAddress,
      schoolName,
      religion,
      gender,
      whatsapp
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        dob,
        bloodGroup,
        presentAddress,
        permanentAddress,
        schoolName,
        religion,
        gender,
        whatsapp
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
