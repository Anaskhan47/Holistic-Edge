import nodemailer from 'nodemailer';

async function testDirectSMTP() {
  console.log('Testing Gmail SMTP with credentials from SMTPEmailProvider...');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'holisticedges@gmail.com',
      pass: 'cooistxnbltwyywz'
    },
    tls: { rejectUnauthorized: false }
  });

  try {
    const verify = await transporter.verify();
    console.log('SMTP Connection Verified:', verify);

    const testRecipients = [
      'anasahmedkhan845@gmail.com',
      'ahmedkhanans57@gmail.com',
      'imoo12333@gmail.com',
      'daaraynorg@gmail.com'
    ];

    for (const recipient of testRecipients) {
      console.log(`Sending live delivery to: ${recipient}...`);
      const info = await transporter.sendMail({
        from: '"Holistic Edge Wellness Centre" <holisticedges@gmail.com>',
        to: recipient,
        subject: 'Holistic Edge Wellness Centre — Appointment Confirmation',
        text: 'Dear Valued Patient,\n\nYour appointment at Holistic Edge Chiropractic & Wellness Clinic is confirmed.\n\nFounder: Healer Abdul Mallik\nHolistic Edge Wellness Centre',
        html: '<div style="font-family: Arial, sans-serif; padding: 24px; color: #0F2747; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 8px;">' +
              '<h2 style="color: #0F2747; margin-top: 0;">Holistic Edge Chiropractic &amp; Wellness Clinic</h2>' +
              '<p>Dear Valued Patient,</p>' +
              '<p>Your appointment has been successfully confirmed at Holistic Edge.</p>' +
              '<div style="background-color: #F8FAFC; padding: 16px; border-left: 4px solid #0F2747; border-radius: 4px; margin: 20px 0;">' +
              '<p style="margin: 4px 0;"><strong>Clinic:</strong> Holistic Edge Wellness Centre</p>' +
              '<p style="margin: 4px 0;"><strong>Founder &amp; Chief Healer:</strong> Healer Abdul Mallik</p>' +
              '<p style="margin: 4px 0;"><strong>Location:</strong> Ground Floor, Susheel Apartments, Behind Olive Hospital, Mehdipatnam, Hyderabad</p>' +
              '<p style="margin: 4px 0;"><strong>Contact:</strong> +91 81426 42051</p>' +
              '</div>' +
              '<p style="font-size: 13px; color: #64748B;">This is a verified live notification from the Holistic Edge platform.</p>' +
              '</div>'
      });
      console.log(`Email Sent to ${recipient}! Message ID: ${info.messageId}`);
    }
  } catch (err) {
    console.error('SMTP Test Error:', err);
  }
}

testDirectSMTP();
