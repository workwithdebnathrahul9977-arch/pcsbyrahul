import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';

class WhatsAppService {
  private client: Client;
  private qrCodeData: string | null = null;
  private isReady: boolean = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-extensions'],
        headless: true
      }
    });

    this.client.on('qr', async (qr) => {
      try {
        this.qrCodeData = await QRCode.toDataURL(qr);
        this.isReady = false;
        console.log('WhatsApp: QR CODE generated. Scan from Admin Panel.');
      } catch (err) {
        console.error('WhatsApp QR Generation Error:', err);
      }
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.qrCodeData = null;
      console.log('WhatsApp: Client is ready!');
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp was disconnected:', reason);
      this.isReady = false;
      this.client.initialize(); // Try to get a new QR
    });

    this.client.on('auth_failure', msg => {
      console.error('WhatsApp AUTH_FAILURE', msg);
      this.isReady = false;
    });

    // Initialize the client
    this.client.initialize().catch(err => {
      console.error('WhatsApp init error:', err);
    });
  }

  public getStatus() {
    return {
      isReady: this.isReady,
      qrCode: this.qrCodeData
    };
  }

  public async sendMessage(phone: string, message: string) {
    if (!this.isReady) {
      throw new Error('WhatsApp Client is not ready. Please scan the QR code in Settings.');
    }
    
    // Format phone: 8801XXXXXXXXX@c.us
    let formatted = phone.replace(/[^0-9]/g, ''); // Remove non-numeric
    if (formatted.startsWith('01')) {
      formatted = '88' + formatted;
    }
    if (!formatted.includes('@c.us')) {
      formatted = `${formatted}@c.us`;
    }

    try {
      const response = await this.client.sendMessage(formatted, message);
      return response;
    } catch (err) {
      console.error('WhatsApp Send Error:', err);
      throw err;
    }
  }

  public async logout() {
    try {
      await this.client.logout();
      this.isReady = false;
      this.qrCodeData = null;
      this.client.initialize();
    } catch (err) {
      console.error('WhatsApp Logout Error:', err);
      throw err;
    }
  }
}

export const whatsappService = new WhatsAppService();
