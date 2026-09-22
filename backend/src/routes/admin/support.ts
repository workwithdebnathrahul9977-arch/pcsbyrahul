import express from 'express';
import prisma from '../../prismaClient';

const router = express.Router();

// 1. Get all conversations (Admin)
router.get('/', async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    // Attach student photoUrl if they exist
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        let userPhoto = null;
        let userRole = null;
        if (conv.phone) {
          const user = await prisma.user.findFirst({
            where: { phone: conv.phone },
            select: { photoUrl: true, role: true }
          });
          if (user) {
            userPhoto = user.photoUrl;
            userRole = user.role;
          }
        }
        return {
          ...conv,
          userPhoto,
          userRole
        };
      })
    );

    res.json(enrichedConversations);
  } catch (error) {
    console.error('Error fetching admin conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Reply to a conversation (Admin)
router.post('/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        conversationId: id,
        senderType: 'ADMIN',
        content: message
      }
    });

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    res.json(newMessage);
  } catch (error) {
    console.error('Error sending admin reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Update conversation status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // OPEN or CLOSED

  try {
    const conversation = await prisma.conversation.update({
      where: { id },
      data: { status }
    });
    res.json(conversation);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
