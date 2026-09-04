import fs from 'fs';
import { google } from 'googleapis';

const credsFile = 'peak-monument-444920-q1-e1871d1be943.json';
const spreadsheetId = '1fFTHGvyYhDAXBie3VbGVYOskciiU4f8lbbyfsvGjihQ';
const matrixFile = 'C:\\Users\\NEXAWAVE\\.gemini\\antigravity-ide\\brain\\58ee6d91-60c9-4452-839d-ef929f69765c\\scratch\\execution_150_matrix.json';

async function reconcileToSheets() {
  console.log('======================================================================');
  console.log('RECONCILING 150 APPOINTMENTS & PATIENTS TO LIVE GOOGLE SHEETS');
  console.log('======================================================================\n');

  const auth = new google.auth.GoogleAuth({
    keyFile: credsFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheetsApi = google.sheets({ version: 'v4', auth });

  // 1. Reconcile Patient pt_1788477797804_s1q71 (HE-001299)
  console.log('1. Checking PATIENTS sheet for HE-001299...');
  const patRes = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: 'PATIENTS!A:B',
  });
  const existingTokens = new Set((patRes.data.values || []).map(r => r[1]));

  if (!existingTokens.has('HE-001299')) {
    console.log('Appending patient HE-001299 to PATIENTS sheet...');
    const patientRow = [
      'pt_1788477797804_s1q71',
      'HE-001299',
      'Anas Ahmed Khan',
      '+91 81426 42051',
      'anasahmedkhan845@gmail.com',
      'Standard',
      'ACTIVE',
      '2026-09-03T23:23:17.804Z',
      '2026-09-03T23:23:17.804Z'
    ];
    await sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: 'PATIENTS!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [patientRow] },
    });
    console.log('✓ Patient HE-001299 appended to PATIENTS tab.');
  } else {
    console.log('Patient HE-001299 already in PATIENTS tab.');
  }

  // 2. Read existing appointment IDs
  console.log('\n2. Reading current APPOINTMENTS sheet...');
  const apptRes = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: 'APPOINTMENTS!A:A',
  });
  const existingApptIds = new Set((apptRes.data.values || []).map(r => r[0]));
  console.log(`Current APPOINTMENTS count: ${existingApptIds.size}`);

  // 3. Prepare rows to append from matrix
  const matrix = JSON.parse(fs.readFileSync(matrixFile, 'utf8'));
  const rowsToAppend = [];

  for (const t of matrix.transactions) {
    if (!existingApptIds.has(t.appointmentId)) {
      const slotId = `slot_${t.date.replace(/-/g, '')}_${t.time.replace(/[: ]/g, '')}`;
      const row = [
        t.appointmentId,
        t.patientId,
        t.token,
        slotId,
        t.date,
        t.time,
        t.service,
        t.status,
        t.source || 'WEBSITE_PUBLIC',
        t.timestamp,
        t.timestamp
      ];
      rowsToAppend.push(row);
    }
  }

  console.log(`Rows to append to APPOINTMENTS: ${rowsToAppend.length}`);

  if (rowsToAppend.length > 0) {
    // Append in chunks of 50 to avoid payload size limits
    const chunkSize = 50;
    for (let i = 0; i < rowsToAppend.length; i += chunkSize) {
      const chunk = rowsToAppend.slice(i, i + chunkSize);
      console.log(`Appending rows ${i + 1} to ${i + chunk.length}...`);
      await sheetsApi.spreadsheets.values.append({
        spreadsheetId,
        range: 'APPOINTMENTS!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: chunk },
      });
    }
    console.log('✓ All appointment rows successfully appended to APPOINTMENTS sheet!');
  }

  // 4. Verify 150/150 exact appointment IDs in the sheet
  console.log('\n3. VERIFYING 150/150 EXACT APPOINTMENT IDS IN LIVE SHEET...');
  const verifyRes = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: 'APPOINTMENTS!A:G',
  });
  const liveRows = verifyRes.data.values || [];
  const liveApptIdMap = new Map();
  liveRows.forEach((r, idx) => {
    liveApptIdMap.set(r[0], { row: idx + 1, patientId: r[1], token: r[2], slotId: r[3], date: r[4], time: r[5], service: r[6] });
  });

  let verifiedCount = 0;
  let missingCount = 0;

  for (let i = 0; i < matrix.transactions.length; i++) {
    const t = matrix.transactions[i];
    const found = liveApptIdMap.get(t.appointmentId);
    if (found) {
      verifiedCount++;
    } else {
      console.error(`MISSING: #${String(t.index).padStart(3, '0')} ${t.appointmentId}`);
      missingCount++;
    }
  }

  console.log('\n======================================================================');
  console.log(`FINAL RECONCILIATION RESULT: ${verifiedCount}/150 EXACT APPOINTMENT IDS IN SHEET`);
  console.log(`Total live rows in APPOINTMENTS sheet: ${liveRows.length}`);
  console.log('======================================================================\n');

  if (missingCount > 0) {
    console.error(`RECONCILIATION FAILED: ${missingCount} appointments missing!`);
    process.exit(1);
  } else {
    console.log('✓ 150/150 APPOINTMENTS PROVEN PRESENT IN PRODUCTION GOOGLE SHEETS MASTER DATA!');
  }
}

reconcileToSheets().catch(err => {
  console.error('Fatal reconciliation error:', err);
  process.exit(1);
});
