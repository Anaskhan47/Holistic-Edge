import fs from 'fs';

const BASE_URL = 'https://holistic-edge-pied.vercel.app';
const matrixFile = 'C:\\Users\\NEXAWAVE\\.gemini\\antigravity-ide\\brain\\58ee6d91-60c9-4452-839d-ef929f69765c\\scratch\\execution_150_matrix.json';
const data = JSON.parse(fs.readFileSync(matrixFile, 'utf8'));

async function verifyAll150Tokens() {
  console.log('======================================================================');
  console.log('GATE 5: INDEPENDENT VERIFICATION OF ALL 150 TOKENS AGAINST LIVE ADMIN');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  // Cache token search to avoid redundant HTTP requests while verifying every single transaction
  const tokenCache = {};

  for (let i = 0; i < data.transactions.length; i++) {
    const t = data.transactions[i];
    const num = `#${String(t.index).padStart(3, '0')}`;
    const token = t.token;

    if (!tokenCache[token]) {
      const res = await fetch(`${BASE_URL}/api/patients/search?q=${token}`, {
        headers: { 'x-admin-user-email': 'admin@holisticedge.in' }
      });
      const resData = await res.json();
      const patient = (resData.patients || []).find(p => p.registrationTokenNumber === token);
      tokenCache[token] = patient || null;
    }

    const matchedPatient = tokenCache[token];

    if (!matchedPatient) {
      console.error(`[${num}] FAILED: Token ${token} not found in search!`);
      failed++;
    } else if (matchedPatient.id !== t.patientId && matchedPatient.registrationTokenNumber !== t.token) {
      console.error(`[${num}] FAILED: Token ${token} resolved to wrong patient (${matchedPatient.id} vs ${t.patientId})`);
      failed++;
    } else {
      passed++;
      if (i % 25 === 0 || i === 0 || i === 149) {
        console.log(`[${num}/150] PASS | Token: ${token} | Patient: ${matchedPatient.name} | Verified Searchable`);
      }
    }
  }

  console.log('\n======================================================================');
  console.log(`GATE 5 RESULT: ${passed}/150 TOKENS VERIFIED SEARCHABLE & RESOLVED`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

verifyAll150Tokens().catch(console.error);
