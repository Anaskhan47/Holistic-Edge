import { google } from 'googleapis';
import fs from 'fs';

const credsFile = 'c:\\Users\\NEXAWAVE\\Downloads\\holistic-edge-chiropractic-&-wellness-clinic\\peak-monument-444920-q1-e1871d1be943.json';
const spreadsheetId = '1fFTHGvyYhDAXBie3VbGVYOskciiU4f8lbbyfsvGjihQ';

async function testKeyFile() {
  const auth = new google.auth.GoogleAuth({
    keyFile: credsFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheetsApi = google.sheets({ version: 'v4', auth });
  const meta = await sheetsApi.spreadsheets.get({ spreadsheetId });
  const titles = meta.data.sheets.map(s => s.properties.title);
  console.log('Successfully connected to Google Sheets! Tabs:', titles);

  for (const title of titles) {
    try {
      const res = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${title}!A:A`,
      });
      console.log(`Sheet [${title}]: ${res.data.values?.length || 0} rows`);
    } catch (e) {
      console.log(`Sheet [${title}] error:`, e.message);
    }
  }
}

testKeyFile().catch(console.error);
