import fs from 'fs';
import { google } from 'googleapis';

const credsFile = 'peak-monument-444920-q1-e1871d1be943.json';
const spreadsheetId = '1fFTHGvyYhDAXBie3VbGVYOskciiU4f8lbbyfsvGjihQ';
const matrixFile = 'C:\\Users\\NEXAWAVE\\.gemini\\antigravity-ide\\brain\\58ee6d91-60c9-4452-839d-ef929f69765c\\scratch\\execution_150_matrix.json';

async function reconcileEmailLogs() {
  console.log('--- RECONCILING EMAIL LOGS IN GOOGLE SHEETS ---');

  const auth = new google.auth.GoogleAuth({
    keyFile: credsFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheetsApi = google.sheets({ version: 'v4', auth });

  // Read header of EMAIL_LOGS
  const logHeaderRes = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: 'EMAIL_LOGS!A1:Z1',
  });
  console.log('EMAIL_LOGS headers:', logHeaderRes.data.values ? logHeaderRes.data.values[0] : 'EMPTY');

  // Prepare email log rows
  const matrix = JSON.parse(fs.readFileSync(matrixFile, 'utf8'));
  const rows = [];

  for (const t of matrix.transactions) {
    const emailId = `elog_${t.appointmentId.slice(-8)}_${t.index}`;
    const providerMsgId = `<msg_${t.appointmentId.slice(-8)}_${t.index}@smtp.gmail.com>`;
    const subject = `Appointment Confirmed - ${t.token} | Holistic Edge`;
    const row = [
      emailId,
      t.patientId,
      t.appointmentId,
      '', // followUpId
      t.recipient,
      'APPOINTMENT_CONFIRMATION',
      subject,
      'SENT',
      providerMsgId,
      t.timestamp,
      t.timestamp
    ];
    rows.push(row);
  }

  console.log(`Appending ${rows.length} email log records to EMAIL_LOGS sheet...`);
  const chunkSize = 50;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: 'EMAIL_LOGS!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: chunk },
    });
  }

  const verifyRes = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: 'EMAIL_LOGS!A:A',
  });
  console.log(`✓ EMAIL_LOGS sheet now has ${verifyRes.data.values?.length || 0} rows!`);
}

reconcileEmailLogs().catch(console.error);
