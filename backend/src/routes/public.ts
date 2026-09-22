import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 1. Student Info Search
router.post('/student-info', async (req, res) => {
  try {
    const { studentId, registrationNo } = req.body;
    
    if (!studentId || !registrationNo) {
      return res.status(400).json({ error: 'Student ID and Registration No are required' });
    }

    const student = await prisma.user.findFirst({
      where: {
        role: 'STUDENT',
        studentId,
        registrationNo
      },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        studentId: true,
        registrationNo: true,
        registrationYear: true,
        phone: true,
        fatherName: true,
        motherName: true,
        presentAddress: true,
        schoolName: true,
        studentClass: true,
        group: true,
        bloodGroup: true,
        gender: true,
        enrollments: {
          include: {
            batch: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found with provided details' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student info:', error);
    res.status(500).json({ error: 'Failed to fetch student info' });
  }
});

// 2. Admit Card Search
router.post('/admit-card', async (req, res) => {
  try {
    const { studentClass, registrationNo } = req.body;

    if (!studentClass || !registrationNo) {
      return res.status(400).json({ error: 'Class and Registration No are required' });
    }

    const student = await prisma.user.findFirst({
      where: {
        role: 'STUDENT',
        studentClass,
        registrationNo
      },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        studentId: true,
        registrationNo: true,
        studentClass: true,
        schoolName: true,
        group: true,
        enrollments: {
          where: { status: 'ACTIVE' },
          include: {
            batch: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'No student found for the given criteria' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error generating admit card:', error);
    res.status(500).json({ error: 'Failed to generate admit card' });
  }
});

// 3. Single Marksheet
router.post('/marksheet/single', async (req, res) => {
  try {
    const { registrationNo, studentId, date } = req.body;

    if (!registrationNo || !studentId || !date) {
      return res.status(400).json({ error: 'Registration No, Student ID and Date are required' });
    }

    // Find student first
    const student = await prisma.user.findFirst({
      where: { role: 'STUDENT', registrationNo, studentId },
      select: { id: true, name: true, studentId: true, registrationNo: true, studentClass: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Parse date range for the specific day
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    // Find exams for this student on this date
    const results = await prisma.examResult.findMany({
      where: {
        userId: student.id,
        exam: {
          date: {
            gte: searchDate,
            lt: nextDate
          }
        }
      },
      include: {
        exam: true
      }
    });

    res.json({ student, results });
  } catch (error) {
    console.error('Error fetching single marksheet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. All Marksheet (Complex Search)
router.post('/marksheet/all', async (req, res) => {
  try {
    const { registrationYear, studentClass, registrationNo, studentId, examType, fromDate, toDate } = req.body;

    if (!registrationNo || !studentId) {
      return res.status(400).json({ error: 'Registration No and Student ID are required' });
    }

    const studentWhere: any = { role: 'STUDENT', registrationNo, studentId };
    if (registrationYear) studentWhere.registrationYear = registrationYear;
    if (studentClass) studentWhere.studentClass = studentClass;

    const student = await prisma.user.findFirst({
      where: studentWhere,
      select: { id: true, name: true, studentId: true, registrationNo: true, studentClass: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found matching all criteria' });
    }

    const examWhere: any = {};
    if (examType) examWhere.type = examType;
    if (fromDate || toDate) {
      examWhere.date = {};
      if (fromDate) examWhere.date.gte = new Date(fromDate);
      if (toDate) examWhere.date.lte = new Date(toDate);
    }

    const results = await prisma.examResult.findMany({
      where: {
        userId: student.id,
        exam: examWhere
      },
      include: {
        exam: true
      },
      orderBy: {
        exam: { date: 'desc' }
      }
    });

    res.json({ student, results });
  } catch (error) {
    console.error('Error fetching marksheet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Public Exam List
router.get('/exams', async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        batch: {
          include: {
            academicClass: true
          }
        }
      }
    });

    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// 6. Public Academic Classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await prisma.academicClass.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

export default router;
