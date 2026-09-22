import express from 'express';
import { whatsappService } from '../../services/whatsapp';

const router = express.Router();

// Get Status (Is Ready? QR Code?)
router.get('/status', (req, res) => {
  try {
    const status = whatsappService.getStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  try {
    await whatsappService.sendMessage(phone, message);
    res.json({ success: true, message: 'Sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Logout / Disconnect
router.post('/logout', async (req, res) => {
  try {
    await whatsappService.logout();
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
