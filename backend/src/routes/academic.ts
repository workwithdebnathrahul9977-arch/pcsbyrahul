import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

// Classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await prisma.academicClass.findMany({ orderBy: { name: 'asc' } });
    res.json(classes);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/classes', async (req, res) => {
  try {
    const newClass = await prisma.academicClass.create({ data: { name: req.body.name } });
    res.json(newClass);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await prisma.academicSubject.findMany({ orderBy: { name: 'asc' } });
    res.json(subjects);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/subjects', async (req, res) => {
  try {
    const newSub = await prisma.academicSubject.create({ data: { name: req.body.name } });
    res.json(newSub);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await prisma.academicGroup.findMany({ orderBy: { name: 'asc' } });
    res.json(groups);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/groups', async (req, res) => {
  try {
    const newGrp = await prisma.academicGroup.create({ data: { name: req.body.name } });
    res.json(newGrp);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Batches
router.get('/batches', async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      include: { academicClass: true, academicGroup: true, subjects: true }
    });
    res.json(batches);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/batches', async (req, res) => {
  try {
    const { name, classId, groupId, subjectIds, sessionYear, startingDate, closingDate, admissionFee, tuitionFee, courseFee } = req.body;
    
    const dataObj: any = {
      name, 
      sessionYear,
      admissionFee: admissionFee ? Number(admissionFee) : 0, 
      tuitionFee: tuitionFee ? Number(tuitionFee) : 0, 
      courseFee: courseFee ? Number(courseFee) : 0
    };
    if (classId) dataObj.classId = classId;
    if (groupId) dataObj.groupId = groupId;
    if (startingDate) dataObj.startingDate = new Date(startingDate);
    if (closingDate) dataObj.closingDate = new Date(closingDate);
    if (subjectIds && subjectIds.length > 0) {
      dataObj.subjects = { connect: subjectIds.map((id: string) => ({ id })) };
    }

    const newBatch = await prisma.batch.create({ data: dataObj });
    res.json(newBatch);
  } catch (error) { 
    console.error('Batches POST Error:', error);
    res.status(500).json({ error: 'Server error' }); 
  }
});

router.delete('/batches/:id', async (req, res) => {
  try {
    await prisma.batch.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/classes/:id', async (req, res) => {
  try {
    await prisma.academicClass.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/groups/:id', async (req, res) => {
  try {
    await prisma.academicGroup.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    await prisma.academicSubject.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/batches/:id', async (req, res) => {
  try {
    const { name, classId, groupId, subjectIds, sessionYear, startingDate, closingDate, admissionFee, tuitionFee, courseFee } = req.body;
    const dataObj: any = { name, sessionYear };
    if (admissionFee !== undefined) dataObj.admissionFee = Number(admissionFee);
    if (tuitionFee !== undefined) dataObj.tuitionFee = Number(tuitionFee);
    if (courseFee !== undefined) dataObj.courseFee = Number(courseFee);
    if (classId !== undefined) dataObj.classId = classId;
    if (groupId !== undefined) dataObj.groupId = groupId;
    if (startingDate) dataObj.startingDate = new Date(startingDate);
    if (closingDate) dataObj.closingDate = new Date(closingDate);
    if (subjectIds) dataObj.subjects = { set: subjectIds.map((id: string) => ({ id })) };
    
    await prisma.batch.update({ where: { id: req.params.id }, data: dataObj });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/classes/:id', async (req, res) => {
  try {
    await prisma.academicClass.update({ where: { id: req.params.id }, data: { name: req.body.name } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/groups/:id', async (req, res) => {
  try {
    await prisma.academicGroup.update({ where: { id: req.params.id }, data: { name: req.body.name } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/subjects/:id', async (req, res) => {
  try {
    await prisma.academicSubject.update({ where: { id: req.params.id }, data: { name: req.body.name } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
