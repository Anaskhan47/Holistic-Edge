import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'holisticedges@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'cooistxnbltwyywz',
  },
});

async function testEmails() {
  console.log('Verifying SMTP transport...');
  await transporter.verify();
  console.log('SMTP connection verified successfully!');

  // Test 1: ahmedkhanans57@gmail.com
  console.log('\nSending test to ahmedkhanans57@gmail.com (as spelled in prompt)...');
  const res1 = await transporter.sendMail({
    from: '"Holistic Edge Wellness Centre" <holisticedges@gmail.com>',
    to: 'ahmedkhanans57@gmail.com',
    subject: 'Urgent Test - Holistic Edge Verification (ans)',
    text: 'Testing delivery to ahmedkhanans57@gmail.com'
  });
  console.log('Result 1 (ans):', res1.response, res1.messageId);

  // Test 2: ahmedkhananas57@gmail.com (with "anas")
  console.log('\nSending test to ahmedkhananas57@gmail.com (with "anas")...');
  const res2 = await transporter.sendMail({
    from: '"Holistic Edge Wellness Centre" <holisticedges@gmail.com>',
    to: 'ahmedkhananas57@gmail.com',
    subject: 'Urgent Test - Holistic Edge Verification (anas)',
    text: 'Testing delivery to ahmedkhananas57@gmail.com'
  });
  console.log('Result 2 (anas):', res2.response, res2.messageId);
}

testEmails().catch(console.error);
