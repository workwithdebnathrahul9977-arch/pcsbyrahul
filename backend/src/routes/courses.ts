import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all courses (with optional limit)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const courses = await prisma.course.findMany({
      take: limit,
      orderBy: { order: 'asc' }
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Reorder courses
router.put('/reorder', async (req, res) => {
  try {
    const { courseIds } = req.body; // Array of IDs in the new order
    if (!Array.isArray(courseIds)) {
      return res.status(400).json({ error: 'courseIds must be an array' });
    }

    // Execute all updates in a transaction
    await prisma.$transaction(
      courseIds.map((id, index) => 
        prisma.course.update({
          where: { id },
          data: { order: index }
        })
      )
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering courses:', error);
    res.status(500).json({ error: 'Failed to reorder courses' });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl, fee, originalFee, type, category, paymentType, durationMonths, academicClassId, academicGroupId, academicSubjectId } = req.body;
    
    if (!title || fee === undefined) {
      return res.status(400).json({ error: 'Title and fee are required' });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl,
        fee: parseFloat(fee),
        originalFee: originalFee ? parseFloat(originalFee) : null,
        type: type || 'Offline',
        category: category || 'SSC',
        paymentType: paymentType || 'MONTHLY',
        durationMonths: durationMonths ? parseInt(durationMonths) : null,
        academicClassId: academicClassId || null,
        academicGroupId: academicGroupId || null,
        academicSubjectId: academicSubjectId || null
      }
    });
    res.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, fee, originalFee, type, category, paymentType, durationMonths, academicClassId, academicGroupId, academicSubjectId } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        fee: fee !== undefined ? parseFloat(fee) : undefined,
        originalFee: originalFee !== undefined ? (originalFee ? parseFloat(originalFee) : null) : undefined,
        type,
        category,
        paymentType,
        durationMonths: durationMonths !== undefined ? (durationMonths ? parseInt(durationMonths) : null) : undefined,
        academicClassId: academicClassId !== undefined ? academicClassId : undefined,
        academicGroupId: academicGroupId !== undefined ? academicGroupId : undefined,
        academicSubjectId: academicSubjectId !== undefined ? academicSubjectId : undefined
      }
    });
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course is attached to any batches before deleting
    const course = await prisma.course.findUnique({
      where: { id },
      include: { batches: true }
    });

    if (course?.batches && course.batches.length > 0) {
      return res.status(400).json({ error: 'Cannot delete course with active batches' });
    }

    await prisma.course.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
