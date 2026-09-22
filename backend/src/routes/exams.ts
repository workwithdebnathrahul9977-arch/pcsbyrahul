import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// --- EXAM CATEGORIES ---

router.get('/categories', async (req, res) => {
  try {
    const cats = await prisma.examCategory.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/categories', async (req, res) => {
  const { name, description } = req.body;
  try {
    const cat = await prisma.examCategory.create({ data: { name, description } });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/categories/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const cat = await prisma.examCategory.update({
      where: { id: req.params.id },
      data: { name, description }
    });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.examCategory.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// --- EXAMS ---

router.get('/', async (req, res) => {
  try {
    const { start, end, academicClassId, batchId, examCategoryId } = req.query;
    let where: any = {};
    if (academicClassId) where.academicClassId = String(academicClassId);
    if (batchId) where.batchId = String(batchId);
    if (examCategoryId) where.examCategoryId = String(examCategoryId);
    
    if (start && end) {
      where.date = { gte: new Date(String(start)), lte: new Date(String(end)) };
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        academicClass: true,
        batch: true,
        academicSubject: true,
        examCategory: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { 
    title, topicName, academicClassId, batches, batchId, academicSubjectId, 
    examCategoryId, date, showMarksTitle, hasMcq, hasCq, hasWritten,
    totalMark, mcqMark, cqMark, writtenMark 
  } = req.body;

  try {
    const exam = await prisma.exam.create({
      data: {
        title, topicName, academicClassId, batches, batchId, academicSubjectId,
        examCategoryId, date: new Date(date), showMarksTitle, hasMcq, hasCq, hasWritten,
        totalMark, mcqMark, cqMark, writtenMark
      }
    });
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const exam = await prisma.exam.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.exam.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});


// --- EXAM RESULTS (MARKS ENTRY) ---

router.get('/:id', async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: {
        academicClass: true,
        batch: true,
        academicSubject: true,
      }
    });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/students', async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    
    // Find students enrolled in the batch
    let students = [];
    if (exam.batchId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { batchId: exam.batchId, status: 'ACTIVE' },
        include: { user: true }
      });
      students = enrollments.map(e => e.user);
    } else if (exam.batches) {
      const batchNames = exam.batches.split(',').map(n => n.trim());
      const enrollments = await prisma.enrollment.findMany({
        where: { batch: { name: { in: batchNames } }, status: 'ACTIVE' },
        include: { user: true }
      });
      students = enrollments.map(e => e.user);
      // Remove duplicates just in case
      students = students.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    } else {
      // If no specific batch, just return empty or all students in class? 
      // For simplicity, let's just return all students if no batchId is set
      students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
    }

    // Find existing results
    const results = await prisma.examResult.findMany({ where: { examId } });
    const resultMap = {};
    results.forEach(r => resultMap[r.userId] = r);

    const data = students.map(s => ({
      user: s,
      result: resultMap[s.id] || null
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/marks', async (req, res) => {
  try {
    const examId = req.params.id;
    const { marks } = req.body; // Array of { userId, mcqMarks, cqMarks, writtenMarks, isPresent }
    
    // Upsert all marks
    const transactions = marks.map((m: any) => {
      const totalMarks = (m.mcqMarks || 0) + (m.cqMarks || 0) + (m.writtenMarks || 0);
      return prisma.examResult.upsert({
        where: { examId_userId: { examId, userId: m.userId } },
        create: {
          examId, userId: m.userId,
          mcqMarks: m.mcqMarks || 0,
          cqMarks: m.cqMarks || 0,
          writtenMarks: m.writtenMarks || 0,
          totalMarks,
          isPresent: m.isPresent
        },
        update: {
          mcqMarks: m.mcqMarks || 0,
          cqMarks: m.cqMarks || 0,
          writtenMarks: m.writtenMarks || 0,
          totalMarks,
          isPresent: m.isPresent
        }
      });
    });
    
    await prisma.$transaction(transactions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save marks' });
  }
});

export default router;

