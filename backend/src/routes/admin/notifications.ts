import express from 'express';
import { PrismaClient } from '@prisma/client';
import { whatsappService } from '../../services/whatsapp';

const prisma = new PrismaClient();
const router = express.Router();

// --- CATEGORIES ---

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.notificationCategory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a category
router.post('/categories', async (req, res) => {
  try {
    const { bnName, enName, color, icon, defaultTemplate } = req.body;
    const category = await prisma.notificationCategory.create({
      data: { bnName, enName, color, icon, defaultTemplate }
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.notificationCategory.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- NOTIFICATIONS ---

// Get all notifications with stats
router.get('/', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const stats = {
      total: notifications.length,
      published: notifications.filter((n: any) => n.status === 'PUBLISHED').length,
      draft: notifications.filter((n: any) => n.status === 'DRAFT').length,
      seenRate: '0%' 
    };

    res.json({ stats, notifications });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a notification
router.post('/', async (req, res) => {
  try {
    const { title, description, categoryId, type, status, targetType, targetId } = req.body;
    
    const notification = await prisma.notification.create({
      data: { title, description, categoryId, type, status, targetType, targetId }
    });

    if (status === 'PUBLISHED') {
      broadcastWhatsAppMessage(notification).catch(e => console.error("Broadcast failed:", e));
    }

    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    await prisma.notification.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper for broadcasting
async function broadcastWhatsAppMessage(notification: any) {
  try {
    let users = [];

    if (notification.targetType === 'ALL') {
      users = await prisma.user.findMany({ where: { role: 'STUDENT', isActive: true, phone: { not: null } } });
    } else if (notification.targetType === 'CLASS') {
      users = await prisma.user.findMany({ where: { role: 'STUDENT', isActive: true, studentClass: notification.targetId, phone: { not: null } } });
    } else if (notification.targetType === 'BATCH') {
      users = await prisma.user.findMany({ where: { role: 'STUDENT', isActive: true, selectedBatch: notification.targetId, phone: { not: null } } });
    } else if (notification.targetType === 'GROUP') {
      users = await prisma.user.findMany({ where: { role: 'STUDENT', isActive: true, group: notification.targetId, phone: { not: null } } });
    }

    if (!users.length) return;

    const dateStr = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const priorityEmoji = notification.type === 'IMPORTANT' ? '🔴 *জরুরী বিজ্ঞপ্তি*' : '🔵 *সাধারণ বিজ্ঞপ্তি*';

    const formattedMessage = `📢 *${notification.title}*
${priorityEmoji}
🗓️ তারিখ: ${dateStr}
━━━━━━━━━━━━━━━━━━━

${notification.description}

━━━━━━━━━━━━━━━━━━━
🎓 *PhysChemia*
📞 হেল্পলাইন: 017XXXXXXX
🌐 ওয়েবসাইট: www.physchemia.com`;

    let sentCount = 0;
    for (const user of users) {
      if (user.phone) {
        try {
          await whatsappService.sendMessage(user.phone, formattedMessage);
          sentCount++;
        } catch (e) {
          console.error(`Failed to send to ${user.phone}:`, e);
        }
      }
    }

    await prisma.notification.update({
      where: { id: notification.id },
      data: { sentCount }
    });
  } catch (error) {
    console.error("Broadcast Logic Error:", error);
  }
}

export default router;
