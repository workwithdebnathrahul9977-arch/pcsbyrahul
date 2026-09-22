import express from 'express';
import prisma from '../../prismaClient';

const router = express.Router();

// 1. Settings (GET & PUT)
router.get('/settings', async (req, res) => {
  try {
    const hidePhone = await prisma.setting.findUnique({ where: { key: 'ATTENDANCE_HIDE_PHONE' } });
    const autoSelect = await prisma.setting.findUnique({ where: { key: 'ATTENDANCE_AUTO_SUBJECT' } });
    res.json({
      hidePhone: hidePhone?.value === 'true',
      autoSelect: autoSelect?.value === 'true'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/settings', async (req, res) => {
  const { hidePhone, autoSelect } = req.body;
  try {
    await prisma.setting.upsert({
      where: { key: 'ATTENDANCE_HIDE_PHONE' },
      update: { value: hidePhone ? 'true' : 'false' },
      create: { key: 'ATTENDANCE_HIDE_PHONE', value: hidePhone ? 'true' : 'false' }
    });
    await prisma.setting.upsert({
      where: { key: 'ATTENDANCE_AUTO_SUBJECT' },
      update: { value: autoSelect ? 'true' : 'false' },
      create: { key: 'ATTENDANCE_AUTO_SUBJECT', value: autoSelect ? 'true' : 'false' }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Fetch students for Attendance Creation (by class and batch)
router.get('/search-students', async (req, res) => {
  const { classId, batchId } = req.query;
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        batchId: String(batchId)
      },
      include: {
        user: { select: { id: true, name: true, phone: true, photoUrl: true, guardianMobile: true } }
      }
    });
    const students = enrollments.map(e => e.user);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Create Attendance Session
router.post('/sessions', async (req, res) => {
  const { classId, batchId, date, startTime, endTime, subjects, records } = req.body;
  try {
    // Generate a title
    const academicClass = await prisma.academicClass.findUnique({ where: { id: classId } });
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    const dateStr = new Date(date).toISOString().split('T')[0];
    const title = `Class: ${academicClass?.name || classId} - Batch: ${batch?.name || batchId} - ${dateStr}`;

    const totalStudent = records.length;
    const totalPresent = records.filter((r: any) => r.status === 'PRESENT').length;
    const totalAbsent = records.filter((r: any) => r.status === 'ABSENT').length;
    const totalLate = records.filter((r: any) => r.status === 'LATE').length;
    const totalLeave = records.filter((r: any) => r.status === 'LEAVE').length;

    const session = await prisma.attendanceSession.create({
      data: {
        title, classId, batchId, date: new Date(date), startTime, endTime, subjects,
        totalStudent, totalPresent, totalAbsent, totalLate, totalLeave,
        records: {
          create: records.map((r: any) => ({
            studentId: r.studentId,
            status: r.status,
            comment: r.comment
          }))
        }
      }
    });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. List Sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await prisma.attendanceSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        academicClass: true,
        batch: true,
        records: {
          include: {
            student: { select: { id: true, name: true, phone: true, guardianMobile: true } }
          }
        }
      }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Delete Session
router.delete('/sessions/:id', async (req, res) => {
  try {
    await prisma.attendanceSession.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 6. Update Session
router.put('/sessions/:id', async (req, res) => {
  const { records } = req.body;
  try {
    // records = [{ id: recordId, status: 'PRESENT'|'ABSENT', comment: '...' }]
    for (const r of records) {
      await prisma.attendanceRecord.update({
        where: { id: r.id },
        data: { status: r.status, comment: r.comment }
      });
    }
    
    // Recalculate totals
    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.id },
      include: { records: true }
    });
    
    if (session) {
      const totalPresent = session.records.filter((rec: any) => rec.status === 'PRESENT').length;
      const totalAbsent = session.records.filter((rec: any) => rec.status === 'ABSENT').length;
      const totalLate = session.records.filter((rec: any) => rec.status === 'LATE').length;
      const totalLeave = session.records.filter((rec: any) => rec.status === 'LEAVE').length;
      
      await prisma.attendanceSession.update({
        where: { id: req.params.id },
        data: { totalPresent, totalAbsent, totalLate, totalLeave }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
