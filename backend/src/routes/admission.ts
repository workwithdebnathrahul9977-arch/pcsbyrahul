import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

// Create new admission request
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    
    // Create admission request
    const request = await prisma.admissionRequest.create({
      data: {
        photoUrl: data.photoUrl,
        studentClass: data.studentClass,
        selectedBatch: data.selectedBatch,
        studentName: data.studentName,
        studentNickname: data.studentNickname,
        advisorName: data.advisorName,
        advisorMobile: data.advisorMobile,
        
        fatherName: data.fatherName,
        motherName: data.motherName,
        fatherMobile: data.fatherMobile,
        motherMobile: data.motherMobile,
        fatherOccupation: data.fatherOccupation,
        motherOccupation: data.motherOccupation,
        
        presentAddress: data.presentAddress,
        permanentAddress: data.permanentAddress,
        dob: data.dob,
        gender: data.gender,
        group: data.group,
        bloodGroup: data.bloodGroup,
        religion: data.religion,
        studentMobile: data.studentMobile,
        guardianMobile: data.guardianMobile,
        schoolName: data.schoolName,
        schoolRoll: data.schoolRoll,
        subject: data.subject,
        examsOnly: data.examsOnly === true || data.examsOnly === 'true',
        
        admissionFee: parseFloat(data.admissionFee) || 700,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        signatureUrl: data.signatureUrl
      }
    });
    
    res.json({ success: true, request });
  } catch (error) {
    console.error('Error creating admission request:', error);
    res.status(500).json({ error: 'Server error while processing admission' });
  }
});

// Get all requests (for admin)
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.admissionRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
