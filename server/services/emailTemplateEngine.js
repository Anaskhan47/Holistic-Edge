import fs from 'fs';
import path from 'path';

let cachedLogoBase64 = null;

function getLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const logoPath = path.join(process.cwd(), 'public/brand/holistic-edge-official-logo.png');
    if (fs.existsSync(logoPath)) {
      const buf = fs.readFileSync(logoPath);
      cachedLogoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
      return cachedLogoBase64;
    }
  } catch (e) {
    console.error('[emailTemplateEngine] Base64 logo read error:', e.message);
  }
  return 'https://holisticedge.in/brand/holistic-edge-official-logo.png';
}

export function renderTransactionalEmailHtml({
  title = 'Your Appointment is Confirmed',
  patientName = 'Patient',
  introText = 'Thank you for choosing Holistic Edge Wellness Centre. Your appointment has been successfully confirmed.',
  registrationToken = 'HE-250515-0017',
  appointmentDate = 'Wednesday, 21 May 2025',
  appointmentTime = '10:30 AM',
  service = 'Chiropractic Consultation',
  practitionerName = 'Healer Abdul Mallik',
  clinicName = 'Holistic Edge Wellness Centre',
  clinicAddress = 'Ground Floor, Susheel Apartments, Behind Olive Hospital, Mehdipatnam, Hyderabad - 500028',
  clinicPhone = '+91 81426 42051',
  clinicPhoneRaw = '918142642051',
  clinicWhatsappRaw = '918142642051',
  bookingUrl = '',
  buttonText = 'BOOK APPOINTMENT →',
  showDetails = true,
  notes = '',
}) {
  const logoDataUri = getLogoBase64();

  const appointmentDetailsHtml = showDetails ? `
    <tr>
      <td style="padding-bottom: 24px; background-color: #FFFFFF;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; table-layout: fixed;">
          <tr>
            <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; background-color: #F8FAFC;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="28" style="vertical-align: middle; background-color: #F8FAFC;">
                    <span style="font-size: 18px; line-height: 1;">📅</span>
                  </td>
                  <td style="font-family: Georgia, Cambria, serif; font-size: 16px; font-weight: 700; color: #0F2747; vertical-align: middle; background-color: #F8FAFC;">
                    Appointment Details
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 18px; background-color: #F8FAFC;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td width="42%" style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    Token / Registration No.
                  </td>
                  <td width="58%" style="padding: 10px 0; font-size: 14px; color: #0F2747; font-weight: 700; font-family: monospace, sans-serif; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    ${registrationToken || 'HE-PENDING'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    Date
                  </td>
                  <td style="padding: 10px 0; font-size: 13px; color: #0F2747; font-weight: 700; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    ${appointmentDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    Time
                  </td>
                  <td style="padding: 10px 0; font-size: 13px; color: #0F2747; font-weight: 700; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    ${appointmentTime}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    Service
                  </td>
                  <td style="padding: 10px 0; font-size: 13px; color: #0F2747; font-weight: 700; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    ${service}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    Practitioner
                  </td>
                  <td style="padding: 10px 0; font-size: 13px; color: #0F2747; font-weight: 700; border-bottom: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    ${practitionerName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; vertical-align: top; background-color: #F8FAFC; word-break: break-word;">
                    Location
                  </td>
                  <td style="padding: 10px 0; font-size: 13px; color: #334155; font-weight: 600; line-height: 1.4; background-color: #F8FAFC; word-break: break-word;">
                    <strong style="color: #0F2747;">${clinicName}</strong><br />
                    ${clinicAddress}
                  </td>
                </tr>
                ${notes ? `
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748B; font-weight: 500; border-top: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    Note
                  </td>
                  <td style="padding: 10px 0; font-size: 13px; color: #2D6A4F; font-weight: 600; border-top: 1px solid #EDF2F7; background-color: #F8FAFC; word-break: break-word;">
                    ${notes}
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  ` : '';

  const finalBookingUrl = bookingUrl || 'http://localhost:3000/admin/appointments';

  const ctaButtonHtml = `
    <tr>
      <td align="center" style="padding-bottom: 28px; background-color: #FFFFFF;">
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="background-color: #0F2747; border-radius: 8px;" class="cta-cell">
              <a href="${finalBookingUrl}" target="_blank" class="cta-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; display: inline-block; letter-spacing: 0.5px; border-radius: 8px; background-color: #0F2747;">
                ${buttonText}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${title}</title>
  <style type="text/css">
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F8FAFC !important; color: #334155 !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; margin: 0 !important; }
      .fluid-padding { padding: 20px 14px !important; }
      .contact-col { width: 100% !important; display: block !important; margin-bottom: 10px !important; box-sizing: border-box !important; }
      .cta-cell { width: 100% !important; display: block !important; }
      .cta-button { width: 100% !important; display: block !important; box-sizing: border-box !important; text-align: center !important; padding: 14px 16px !important; }
      .logo-img { width: 220px !important; }
    }

    @media (prefers-color-scheme: dark) {
      body, .bg-outer { background-color: #F8FAFC !important; color: #334155 !important; }
      .bg-card { background-color: #FFFFFF !important; color: #334155 !important; border-color: #E2E8F0 !important; }
      .bg-details { background-color: #F8FAFC !important; color: #334155 !important; border-color: #E2E8F0 !important; }
      .text-navy { color: #0F2747 !important; }
      .text-slate { color: #334155 !important; }
      .cta-button { background-color: #0F2747 !important; color: #FFFFFF !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Syncopate', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-outer" style="background-color: #F8FAFC; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 8px; background-color: #F8FAFC;">

        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #F8FAFC;">
          
          <!-- LOGO HEADER -->
          <tr>
            <td align="center" style="padding: 16px 0 20px 0; background-color: #F8FAFC;">
              <img src="${logoDataUri}" alt="Holistic Edge Wellness Centre" width="280" class="logo-img" style="display: block; width: 280px; max-width: 90%; height: auto; border: 0; margin: 0 auto;" />
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td class="bg-card fluid-padding" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 32px 28px 28px 28px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- TITLE -->
                <tr>
                  <td align="center" style="background-color: #FFFFFF;">
                    <h1 class="text-navy" style="margin: 0; font-family: Georgia, Cambria, 'Times New Roman', serif; font-size: 23px; font-weight: 700; color: #0F2747; line-height: 1.3;">
                      ${title}
                    </h1>
                    <div style="width: 32px; height: 3px; background-color: #2D6A4F; border-radius: 2px; margin: 10px auto 20px auto;"></div>
                  </td>
                </tr>

                <!-- GREETING & INTRO -->
                <tr>
                  <td style="font-size: 14px; line-height: 1.6; color: #334155; padding-bottom: 20px; background-color: #FFFFFF;">
                    <p class="text-navy" style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #0F2747;">
                      Hello ${patientName},
                    </p>
                    <p class="text-slate" style="margin: 0; color: #334155;">
                      ${introText}
                    </p>
                  </td>
                </tr>

                <!-- APPOINTMENT DETAILS CARD -->
                ${appointmentDetailsHtml}

                <!-- PRIMARY CTA BUTTON -->
                ${ctaButtonHtml}

                <!-- CONTACT SECTION ("Need to reach us?") -->
                <tr>
                  <td style="padding-top: 20px; border-top: 1px solid #E2E8F0; background-color: #FFFFFF;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 14px; background-color: #FFFFFF;">
                          <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B;">
                            Need to reach us?
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #FFFFFF;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td width="48%" align="center" class="contact-col" style="padding: 12px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; vertical-align: middle;">
                                <a href="tel:${clinicPhoneRaw}" style="text-decoration: none; color: inherit; display: block;">
                                  <table border="0" cellpadding="0" cellspacing="0" align="center">
                                    <tr>
                                      <td align="center" style="width: 34px; height: 34px; background-color: #EEF2FF; border-radius: 50%; color: #0F2747; font-size: 16px; line-height: 34px;">
                                        📞
                                      </td>
                                      <td style="padding-left: 10px; text-align: left;">
                                        <div style="font-size: 12px; font-weight: 700; color: #0F2747;">Call the Clinic</div>
                                        <div style="font-size: 12px; color: #475569;">${clinicPhone}</div>
                                      </td>
                                    </tr>
                                  </table>
                                </a>
                              </td>
                              <td width="4%" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                              <td width="48%" align="center" class="contact-col" style="padding: 12px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; vertical-align: middle;">
                                <a href="https://wa.me/${clinicWhatsappRaw}" style="text-decoration: none; color: inherit; display: block;">
                                  <table border="0" cellpadding="0" cellspacing="0" align="center">
                                    <tr>
                                      <td align="center" style="width: 34px; height: 34px; background-color: #DCFCE7; border-radius: 50%; color: #166534; font-size: 16px; line-height: 34px;">
                                        💬
                                      </td>
                                      <td style="padding-left: 10px; text-align: left;">
                                        <div style="font-size: 12px; font-weight: 700; color: #0F2747;">WhatsApp Us</div>
                                        <div style="font-size: 12px; color: #475569;">${clinicPhone}</div>
                                      </td>
                                    </tr>
                                  </table>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- CLINIC FOOTER -->
          <tr>
            <td style="padding: 20px 12px; text-align: center; background-color: #F8FAFC;">
              <div style="font-family: Georgia, serif; font-size: 13px; font-weight: 700; color: #0F2747; letter-spacing: 0.5px;">
                ${clinicName}
              </div>
              <div style="width: 24px; height: 2px; background-color: #2D6A4F; margin: 6px auto 10px auto; border-radius: 1px;"></div>
              <div style="font-size: 12px; color: #475569; line-height: 1.4; margin-bottom: 6px;">
                📍 Ground Floor, Susheel Apartments, Behind Olive Hospital, Mehdipatnam, Hyderabad - 500028
              </div>
              <div style="font-size: 12px; color: #475569; margin-bottom: 12px;">
                📞 ${clinicPhone} &nbsp;|&nbsp; ✉️ info@holisticedge.in &nbsp;|&nbsp; 🌐 www.holisticedge.in
              </div>
              <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; font-size: 11px; color: #94A3B8; line-height: 1.5;">
                This is an automated message. Please do not reply directly to this email.<br />
                If you need any help, contact our clinic using the details above.
                <div style="margin-top: 8px; font-size: 11px; color: #64748B;">
                  Website crafted by <a href="https://www.arklintech.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit ARKLINTECH website" style="color: #0F2747 !important; text-decoration: none; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase; font-family: 'Syncopate', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">ARKLINTECH</a>
                </div>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}


