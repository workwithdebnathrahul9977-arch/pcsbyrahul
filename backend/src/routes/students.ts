import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

const studentSelect = {
  id: true, name: true, email: true, phone: true, role: true,
  photoUrl: true, gender: true, dob: true, bloodGroup: true, religion: true,
  presentAddress: true, permanentAddress: true, schoolName: true, schoolRoll: true,
  fatherName: true, fatherMobile: true, fatherOccupation: true,
  motherName: true, motherMobile: true, motherOccupation: true,
  guardianMobile: true, whatsapp: true,
  studentClass: true, selectedBatch: true, group: true, subject: true,
  isActive: true, deactivatedAt: true, deactivationReason: true, createdAt: true, updatedAt: true, studentId: true, registrationNo: true,
};

// GET all students with filters — only enrolled students
router.get('/', async (req, res) => {
  try {
    const { search, studentClass, batch, group, gender, status } = req.query;
    const where: any = {
      role: 'STUDENT',
      enrollments: { some: {} }, // must have at least one enrollment
    };

    if (status === 'active') where.isActive = true;
    else if (status === 'inactive') where.isActive = false;

    if (studentClass) where.studentClass = String(studentClass);
    if (batch) where.selectedBatch = String(batch);
    if (group) where.group = String(group);
    if (gender) where.gender = String(gender);

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { studentId: { contains: String(search), mode: 'insensitive' } },
        { registrationNo: { contains: String(search) } },
        { phone: { contains: String(search) } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { schoolName: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        ...studentSelect,
        enrollments: {
          include: {
            batch: { include: { academicClass: true, academicGroup: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(students);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single student profile
router.get('/:id', async (req, res) => {
  try {
    const student = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...studentSelect,
        payments: { orderBy: { createdAt: 'desc' }, take: 20 },
        ExamResult: {
          include: { exam: true },
          take: 20,
        },
        attendanceRecords: { orderBy: { createdAt: 'desc' }, take: 60 },
      },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (e) {
    console.error("STUDENT GET ERROR:", e);
    res.status(500).json({ error: 'Server error', details: (e as any).message });
  }
});

// UPDATE student profile
router.put('/:id', async (req, res) => {
  try {
    const {
      name, email, phone, photoUrl, gender, dob, bloodGroup, religion,
      presentAddress, permanentAddress, schoolName, schoolRoll,
      fatherName, fatherMobile, fatherOccupation,
      motherName, motherMobile, motherOccupation,
      guardianMobile, whatsapp, studentClass, selectedBatch, group, subject,
      studentId, registrationNo, registrationYear
    } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name,
        email: email === '' ? null : email,
        phone, photoUrl, gender, dob, bloodGroup, religion,
        presentAddress, permanentAddress, schoolName, schoolRoll,
        fatherName, fatherMobile, fatherOccupation,
        motherName, motherMobile, motherOccupation,
        guardianMobile, whatsapp, studentClass, selectedBatch, group, subject,
        studentId: studentId === '' ? null : studentId,
        registrationNo: registrationNo === '' ? null : registrationNo,
        registrationYear
      },
      select: studentSelect,
    });
    res.json({ success: true, student: updated });
  } catch (e: any) {
    console.error('Update Student Error:', e);
    res.status(500).json({ error: 'Server error', details: e.message });
  }
});

// DEACTIVATE student
router.put('/:id/deactivate', async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
        deactivationReason: reason || 'No reason provided',
      },
      select: studentSelect,
    });
    res.json({ success: true, student: updated });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// REACTIVATE student
router.put('/:id/reactivate', async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: true, deactivatedAt: null, deactivationReason: null },
      select: studentSelect,
    });
    res.json({ success: true, student: updated });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// BATCH TRANSFER
router.put('/:id/transfer', async (req, res) => {
  try {
    const { newBatch, newClass } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { selectedBatch: newBatch, studentClass: newClass || undefined },
      select: studentSelect,
    });
    res.json({ success: true, student: updated });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET deactivated students list (enrolled only)
router.get('/list/deactive', async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', isActive: false, enrollments: { some: {} } },
      select: studentSelect,
      orderBy: { deactivatedAt: 'desc' },
    });
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET distinct filter values
router.get('/meta/filters', async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { studentClass: true, selectedBatch: true, group: true, gender: true },
    });
    const classes = [...new Set(students.map(s => s.studentClass).filter(Boolean))];
    const batches = [...new Set(students.map(s => s.selectedBatch).filter(Boolean))];
    const groups = [...new Set(students.map(s => s.group).filter(Boolean))];
    res.json({ classes, batches, groups });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// MARK ATTENDANCE
router.post('/attendance/mark', async (req, res) => {
  try {
    const { records } = req.body; // [{ userId, status, date, batchId }]
    const results = await Promise.all(
      records.map((r: any) =>
        prisma.attendance.upsert({
          where: { userId_date: { userId: r.userId, date: new Date(r.date) } },
          update: { status: r.status, note: r.note },
          create: { userId: r.userId, status: r.status, date: new Date(r.date), batchId: r.batchId, note: r.note },
        })
      )
    );
    res.json({ success: true, count: results.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET attendance report for a student
router.get('/:id/attendance', async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { userId: req.params.id },
      orderBy: { date: 'desc' },
    });
    res.json(records);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE student entirely
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete related records manually to satisfy foreign key constraints
    await prisma.attendanceRecord.deleteMany({ where: { studentId: userId } });
    await prisma.attendance.deleteMany({ where: { userId } });
    await prisma.examResult.deleteMany({ where: { userId } });
    await prisma.payment.deleteMany({ where: { userId } });
    await prisma.enrollment.deleteMany({ where: { userId } });

    // Finally delete the user
    await prisma.user.delete({ where: { id: userId } });

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete Student Error:', error);
    res.status(500).json({ error: 'Server error while deleting student' });
  }
});

export default router;

