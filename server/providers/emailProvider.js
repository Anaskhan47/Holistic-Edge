import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

// Global pooled transporter instance
let globalTransporter = null;

export class EmailProvider {
  async sendEmail({ to, subject, html, text, idempotencyKey, metadata, attachments }) {
    throw new Error('sendEmail must be implemented by provider');
  }
  getStatus() {
    throw new Error('getStatus must be implemented by provider');
  }
  async checkConnection() {
    return { healthy: false, status: 'NOT_IMPLEMENTED', message: 'Not implemented' };
  }
}

export class MockEmailProvider extends EmailProvider {
  constructor() {
    super();
    this.name = 'MockEmailProvider';
    this.sentEmails = [];
  }

  getStatus() {
    return {
      provider: 'Mock / Simulated Email',
      type: 'MOCK',
      configured: true,
      status: 'ONLINE',
      details: 'Simulated email provider for local development & testing.',
    };
  }

  async checkConnection() {
    return {
      healthy: true,
      status: 'CONNECTED',
      message: 'Mock email provider is ready and active.',
    };
  }

  async sendEmail({ to, subject, html, text, idempotencyKey, metadata, attachments }) {
    const messageId = `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const emailRecord = {
      id: messageId,
      to,
      subject,
      html,
      text,
      idempotencyKey,
      metadata,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      providerMessageId: messageId,
    };

    this.sentEmails.push(emailRecord);
    return emailRecord;
  }
}

export class SMTPEmailProvider extends EmailProvider {
  constructor() {
    super();
    this.name = 'SMTPEmailProvider';
    this.host = process.env.SMTP_HOST || 'smtp.gmail.com';
    this.port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465; // Port 465 for Direct SSL/TLS High-Speed Socket
    this.user = process.env.SMTP_USER || 'holisticedges@gmail.com';
    this.pass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : 'cooistxnbltwyywz';
    this.fromEmail = process.env.SMTP_FROM_EMAIL || this.user || 'holisticedges@gmail.com';
    this.fromName = process.env.SMTP_FROM_NAME || 'Holistic Edge Wellness Centre';
    this.isConfigured = Boolean(this.host && this.user && this.pass);

    if (this.isConfigured && !globalTransporter) {
      // Direct SSL/TLS high-speed pooled socket connection
      globalTransporter = nodemailer.createTransport({
        pool: true,              // Reuse persistent SMTP connection pool
        maxConnections: 5,       // 5 simultaneous SMTP socket streams
        maxMessages: 200,        // 200 emails per socket reuse
        rateLimit: 15,           // 15 emails/sec throughput
        host: this.host,
        port: this.port,
        secure: this.port === 465, // Direct SSL on port 465 (bypasses STARTTLS roundtrips)
        auth: {
          user: this.user,
          pass: this.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 4000,
        greetingTimeout: 3000,
        socketTimeout: 10000,
      });
    }
    this.transporter = globalTransporter;
  }

  getStatus() {
    return {
      provider: 'Google Direct SSL High-Speed SMTP Provider',
      type: 'SMTP',
      configured: this.isConfigured,
      status: this.isConfigured ? 'READY' : 'NOT_CONFIGURED',
      details: this.isConfigured
        ? `Configured to ${this.host}:${this.port} (${this.user}) via Direct SSL Socket Pool`
        : 'SMTP credentials missing. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in environment.',
    };
  }

  async checkConnection() {
    if (!this.isConfigured || !this.transporter) {
      return {
        healthy: false,
        status: 'NOT_CONFIGURED',
        message: 'SMTP credentials missing. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in environment.',
      };
    }
    try {
      await this.transporter.verify();
      return {
        healthy: true,
        status: 'CONNECTED',
        message: `Successfully authenticated with ${this.host}:${this.port} as ${this.user} (Direct SSL Active)`,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'ERROR',
        message: `SMTP Connection / Authentication Failed: ${err.message}`,
      };
    }
  }

  async sendEmail({ to, subject, html, text, idempotencyKey, metadata, attachments }) {
    if (!this.isConfigured || !this.transporter) {
      const err = new Error('SMTP credentials are not configured.');
      err.code = 'NOT_CONFIGURED';
      throw err;
    }

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };

    const startTime = Date.now();
    const info = await this.transporter.sendMail(mailOptions);
    const duration = Date.now() - startTime;
    console.log(`[SMTPEmailProvider] ⚡ Real Email Dispatched in ${duration}ms over Direct SSL! Message ID: ${info.messageId}`);
    
    return {
      id: info.messageId,
      to,
      subject,
      idempotencyKey,
      metadata,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      providerMessageId: info.messageId,
      durationMs: duration,
    };
  }
}

class DynamicEmailProviderProxy extends EmailProvider {
  constructor() {
    super();
    this.cachedProvider = null;
  }

  getProvider() {
    if (this.cachedProvider) {
      return this.cachedProvider;
    }
    const providerType = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();
    if (providerType === 'smtp') {
      const smtp = new SMTPEmailProvider();
      if (smtp.isConfigured) {
        this.cachedProvider = smtp;
        return smtp;
      }
    }
    this.cachedProvider = new MockEmailProvider();
    return this.cachedProvider;
  }

  async sendEmail(args) {
    return this.getProvider().sendEmail(args);
  }

  getStatus() {
    return this.getProvider().getStatus();
  }

  async checkConnection() {
    return this.getProvider().checkConnection();
  }
}

let activeSingletonProxy = null;

export function getActiveEmailProvider() {
  if (!activeSingletonProxy) {
    activeSingletonProxy = new DynamicEmailProviderProxy();
  }
  return activeSingletonProxy;
}
