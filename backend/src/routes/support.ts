import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

// 1. Start a new conversation
router.post('/start', async (req, res) => {
  const { name, phone, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and message are required' });
  }

  try {
    const conversation = await prisma.conversation.create({
      data: {
        name,
        phone,
        subject: subject || 'No Subject',
        messages: {
          create: {
            senderType: 'STUDENT',
            content: message,
          }
        }
      },
      include: {
        messages: true
      }
    });
    res.json(conversation);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Get messages for a specific conversation
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Reply to a conversation (Student/Guest)
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
        senderType: 'STUDENT',
        content: message
      }
    });

    // Optionally update the conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    res.json(newMessage);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
