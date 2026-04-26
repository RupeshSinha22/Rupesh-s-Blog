import nodemailer from 'nodemailer';

export const createTransporter = () => {
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
