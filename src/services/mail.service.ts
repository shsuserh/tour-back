import nodemailer from 'nodemailer';
import { env } from '../config/env';

type Mail = { to: string; subject: string; text: string };

// SMTP when SMTP_HOST is set; otherwise the message goes to the log so flows can be tested locally.
const transport = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

class MailService {
  async send({ to, subject, text }: Mail): Promise<void> {
    if (!transport) {
      // Only local development logs the body: it can hold live reset links, which must never reach real logs.
      if (env.NODE_ENV === 'development') {
        console.info(`[mail] SMTP_HOST not set, not sending. To: ${to}\nSubject: ${subject}\n${text}`);
      } else {
        console.error(`[mail] SMTP_HOST not set; email "${subject}" was not sent.`);
      }
      return;
    }
    await transport.sendMail({ from: env.MAIL_FROM, to, subject, text });
  }
}

const mailService = new MailService();
export default mailService;
