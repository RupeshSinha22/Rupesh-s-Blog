import { Router } from 'express';
import prisma from '../lib/prisma.js';
import nodemailer from 'nodemailer';

const router = Router();

// Create reusable transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass || pass === 'YOUR_GMAIL_APP_PASSWORD_HERE') {
    console.warn('⚠️  Email not configured — set EMAIL_USER and EMAIL_APP_PASSWORD in .env');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Save to database
    await prisma.contact.create({
      data: { name, email, subject: subject || 'No subject', message },
    });

    console.log(`📩 New message from ${name} (${email})`);

    // Send email notification
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Rupesh's Blog" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `📬 New Contact: ${subject || 'No subject'} — from ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 24px; border-radius: 12px 12px 0 0;">
                <h2 style="color: #fff; margin: 0; font-size: 1.3rem;">📬 New Contact Form Submission</h2>
              </div>
              <div style="background: #1a1a2e; border: 1px solid rgba(124,58,237,0.2); border-top: none; border-radius: 0 0 12px 12px; padding: 24px; color: #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 12px; color: #a78bfa; font-weight: 600; width: 100px;">Name</td>
                    <td style="padding: 8px 12px; color: #e2e8f0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; color: #a78bfa; font-weight: 600;">Email</td>
                    <td style="padding: 8px 12px;"><a href="mailto:${email}" style="color: #06b6d4;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; color: #a78bfa; font-weight: 600;">Subject</td>
                    <td style="padding: 8px 12px; color: #e2e8f0;">${subject || 'No subject'}</td>
                  </tr>
                </table>
                <div style="margin-top: 16px; padding: 16px; background: rgba(124,58,237,0.1); border-radius: 8px; border: 1px solid rgba(124,58,237,0.15);">
                  <p style="color: #a78bfa; font-weight: 600; margin: 0 0 8px 0; font-size: 0.85rem;">MESSAGE</p>
                  <p style="color: #e2e8f0; margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                </div>
                <p style="color: #64748b; font-size: 0.8rem; margin-top: 16px; text-align: center;">
                  Sent from Rupesh's Blog contact form • ${new Date().toLocaleString()}
                </p>
              </div>
            </div>
          `,
        });
        console.log(`✅ Email notification sent to ${process.env.EMAIL_USER}`);
      } catch (emailErr) {
        console.error('❌ Failed to send email notification:', emailErr.message);
        // Don't fail the request if email fails — the message is already saved in DB
      }
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
