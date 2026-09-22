import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient';
import { whatsappService } from '../services/whatsapp';

const router = express.Router();

// Create new admission request
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Validation 1: Ensure WhatsApp is provided
    if (!data.whatsapp) {
      return res.status(400).json({ error: "হোয়াটসঅ্যাপ নাম্বার অবশ্যই দিতে হবে (WhatsApp number is required)." });
    }

    // Validation 2: Ensure distinct mobile numbers
    const mobiles = [data.studentMobile, data.fatherMobile, data.motherMobile, data.guardianMobile].filter(Boolean);
    const uniqueMobiles = new Set(mobiles);
    if (uniqueMobiles.size !== mobiles.length) {
      return res.status(400).json({ error: "ছাত্র, পিতা, মাতা এবং অভিভাবকের মোবাইল নাম্বারগুলো অবশ্যই আলাদা হতে হবে। একই নাম্বার একাধিক জায়গায় ব্যবহার করা যাবে না।" });
    }

    // Validation 3: Prevent duplicate submissions (PENDING requests)
    const existingPending = await prisma.admissionRequest.findFirst({
      where: {
        OR: [
          { studentMobile: data.studentMobile },
          { whatsapp: data.whatsapp }
        ],
        status: 'PENDING'
      }
    });

    if (existingPending) {
      return res.status(400).json({ error: "আপনার একটি ভর্তির আবেদন ইতোমধ্যেই পেন্ডিং আছে! দয়া করে সেটি এপ্রুভ হওয়া পর্যন্ত অপেক্ষা করুন।" });
    }

    const request = await prisma.admissionRequest.create({
      data: {
        photoUrl: data.photoUrl || null,
        studentClass: data.studentClass,
        selectedBatch: data.selectedBatch,
        studentName: data.studentName,
        studentNickname: data.studentNickname || null,
        advisorName: data.advisorName || null,
        advisorMobile: data.advisorMobile || null,
        
        fatherName: data.fatherName,
        motherName: data.motherName,
        fatherMobile: data.fatherMobile,
        motherMobile: data.motherMobile || null,
        fatherOccupation: data.fatherOccupation || null,
        motherOccupation: data.motherOccupation || null,
        
        presentAddress: data.presentAddress,
        permanentAddress: data.permanentAddress || null,
        dob: data.dob,
        gender: data.gender,
        group: data.group || null,
        bloodGroup: data.bloodGroup || null,
        religion: data.religion || null,
        studentMobile: data.studentMobile,
        guardianMobile: data.guardianMobile || null,
        whatsapp: data.whatsapp || null,
        schoolName: data.schoolName,
        schoolRoll: data.schoolRoll || null,
        subject: data.subject || null,
        examsOnly: data.examsOnly === true || data.examsOnly === 'true',
        
        admissionFee: parseFloat(data.admissionFee) || 700,
        paymentMethod: data.paymentMethod || 'CASH',
        transactionId: data.transactionId || 'N/A',
        signatureUrl: data.signatureUrl || null
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

// Get single request
router.get('/:id', async (req, res) => {
  try {
    const request = await prisma.admissionRequest.findUnique({
      where: { id: req.params.id }
    });
    if (!request) return res.status(404).json({ error: 'Not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Update status (approve/reject) — auto-creates User + Enrollment on approve
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Get the full admission request
    const admission = await prisma.admissionRequest.findUnique({ where: { id: req.params.id } });
    if (!admission) return res.status(404).json({ error: 'Not found' });

    // Prevent duplicate processing if status is already updated
    if (admission.status === status) {
      return res.json({ success: true, request: admission });
    }

    // Update the admission status
    const updated = await prisma.admissionRequest.update({
      where: { id: req.params.id },
      data: { status }
    });

    // If APPROVED → auto-create student User account
    if (status === 'APPROVED') {
      try {
        const autoEmail = `${admission.studentMobile}@physchemia.com`;
        const hashedPw = await bcrypt.hash(admission.studentMobile, 10);

        // Check if user already exists by email or mobile
        let user = await prisma.user.findFirst({
          where: { OR: [{ email: autoEmail }, { phone: admission.studentMobile }] }
        });

        if (!user) {
          const year = new Date().getFullYear().toString(); // e.g. "2026"
          
          // Get class index (1-based) by ordering all classes by creation date
          const allClasses = await prisma.academicClass.findMany({ orderBy: { createdAt: 'asc' } });
          const classIndex = allClasses.findIndex((c: any) => c.name === admission.studentClass);
          const classCode = classIndex >= 0 ? classIndex + 1 : 0; // 1, 2, 3...
          
          // Count existing students in THIS specific class
          const classStudentCount = await prisma.user.count({ 
            where: { role: 'STUDENT', studentClass: admission.studentClass } 
          });
          const sequential = String(classStudentCount + 1).padStart(3, '0'); // 001, 002...
          
          // Format: 2026 + classCode + 001 → e.g. 20261001, 20262001
          const regNo = `${year}${classCode}${sequential}`;
          const sId = regNo;

          user = await prisma.user.create({
            data: {
              name: admission.studentName,
              email: autoEmail,
              password: hashedPw,
              phone: admission.studentMobile,
              role: 'STUDENT',
              studentId: sId,
              registrationNo: regNo,
              registrationYear: year,
              photoUrl: admission.photoUrl || null,
              gender: admission.gender,
              dob: admission.dob,
              bloodGroup: admission.bloodGroup || null,
              religion: admission.religion || null,
              presentAddress: admission.presentAddress,
              permanentAddress: admission.permanentAddress || null,
              schoolName: admission.schoolName,
              schoolRoll: admission.schoolRoll || null,
              fatherName: admission.fatherName,
              fatherMobile: admission.fatherMobile,
              fatherOccupation: admission.fatherOccupation || null,
              motherName: admission.motherName,
              motherMobile: admission.motherMobile || null,
              motherOccupation: admission.motherOccupation || null,
              guardianMobile: admission.guardianMobile || null,
              whatsapp: admission.whatsapp || null,
              studentClass: admission.studentClass,
              selectedBatch: admission.selectedBatch,
              group: admission.group || null,
              subject: admission.subject || null,
              isActive: true,
            }
          });
        } else {
          // If user exists, update their profile with the latest admission details
          let newRegNo = user.registrationNo;
          let newSId = user.studentId;
          let newYear = user.registrationYear;

          // Generate registration number if they don't have one yet
          if (!user.registrationNo) {
            const year = new Date().getFullYear().toString();
            const allClasses = await prisma.academicClass.findMany({ orderBy: { createdAt: 'asc' } });
            const classIndex = allClasses.findIndex((c: any) => c.name === admission.studentClass);
            const classCode = classIndex >= 0 ? classIndex + 1 : 0;
            const classStudentCount = await prisma.user.count({ 
              where: { role: 'STUDENT', studentClass: admission.studentClass } 
            });
            const sequential = String(classStudentCount + 1).padStart(3, '0');
            
            newRegNo = `${year}${classCode}${sequential}`;
            newSId = newRegNo;
            newYear = year;
          }

          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: admission.studentName,
              photoUrl: admission.photoUrl || user.photoUrl,
              gender: admission.gender || user.gender,
              dob: admission.dob || user.dob,
              bloodGroup: admission.bloodGroup || user.bloodGroup,
              religion: admission.religion || user.religion,
              presentAddress: admission.presentAddress || user.presentAddress,
              permanentAddress: admission.permanentAddress || user.permanentAddress,
              schoolName: admission.schoolName || user.schoolName,
              schoolRoll: admission.schoolRoll || user.schoolRoll,
              fatherName: admission.fatherName || user.fatherName,
              fatherMobile: admission.fatherMobile || user.fatherMobile,
              fatherOccupation: admission.fatherOccupation || user.fatherOccupation,
              motherName: admission.motherName || user.motherName,
              motherMobile: admission.motherMobile || user.motherMobile,
              motherOccupation: admission.motherOccupation || user.motherOccupation,
              guardianMobile: admission.guardianMobile || user.guardianMobile,
              whatsapp: admission.whatsapp || user.whatsapp,
              studentClass: admission.studentClass || user.studentClass,
              selectedBatch: admission.selectedBatch || user.selectedBatch,
              group: admission.group || user.group,
              subject: admission.subject || user.subject,
              studentId: newSId,
              registrationNo: newRegNo,
              registrationYear: newYear
            }
          });
        }

        // Try to find batch and create enrollment
        const batch = await prisma.batch.findFirst({
          where: { name: { contains: admission.selectedBatch, mode: 'insensitive' } }
        });

        if (batch && user) {
          await prisma.enrollment.upsert({
            where: { userId_batchId: { userId: user.id, batchId: batch.id } },
            update: { status: 'ACTIVE' },
            create: { userId: user.id, batchId: batch.id, status: 'ACTIVE' }
          });
        }
      } catch (innerErr) {
        console.error('Auto-create user error (non-fatal):', innerErr);
        // Don't fail the whole request if user creation fails
      }
    }

    // --- WhatsApp Notification Logic ---
      try {
        const wpNumber = admission.whatsapp || admission.studentMobile;
        if (wpNumber) {
          if (status === 'APPROVED') {
            const msg = `📢 *ভর্তি নিশ্চিতকরণ*\n🟢 *অভিনন্দন!*\n\nপ্রিয় ${admission.studentName},\nPhysChemia-তে আপনার ভর্তির আবেদনটি সফলভাবে গ্রহণ করা হয়েছে।\n\n🗓️ ক্লাস: ${admission.studentClass}\n📚 ব্যাচ: ${admission.selectedBatch}\n\nএখন আপনি স্টুডেন্ট প্যানেলে লগইন করে আপনার বিস্তারিত তথ্য দেখতে পারবেন। আপনার ইউজারনেম এবং পাসওয়ার্ড হিসেবে আপনার মোবাইল নম্বরটি ব্যবহার করুন।\n\n━━━━━━━━━━━━━━━━━━━\n🎓 *PhysChemia*\n📞 হেল্পলাইন: 017XXXXXXX\n🌐 ওয়েবসাইট: www.physchemia.com`;
            whatsappService.sendMessage(wpNumber, msg).catch(console.error);
          } else if (status === 'REJECTED') {
            const msg = `📢 *ভর্তির আবেদন আপডেট*\n🔴 *দুঃখিত!*\n\nপ্রিয় ${admission.studentName},\nদুঃখজনকভাবে, PhysChemia-তে আপনার ভর্তির আবেদনটি এই মুহূর্তে গ্রহণ করা সম্ভব হয়নি।\n\nযেকোনো তথ্যের জন্য আমাদের হেল্পলাইনে যোগাযোগ করার অনুরোধ করা হলো।\n\n━━━━━━━━━━━━━━━━━━━\n🎓 *PhysChemia*\n📞 হেল্পলাইন: 017XXXXXXX\n🌐 ওয়েবসাইট: www.physchemia.com`;
            whatsappService.sendMessage(wpNumber, msg).catch(console.error);
          }
        }
      } catch (wpErr) {
        console.error('WhatsApp notification failed:', wpErr);
      }
      // -----------------------------------

      res.json({ success: true, request: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete admission request
router.delete('/:id', async (req, res) => {
  try {
    await prisma.admissionRequest.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
