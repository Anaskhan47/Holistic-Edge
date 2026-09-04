import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '1fFTHGvyYhDAXBie3VbGVYOskciiU4f8lbbyfsvGjihQ';
console.log('Using spreadsheet ID:', spreadsheetId);
console.log('Service account email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

async function inspectSheets() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheetsApi = google.sheets({ version: 'v4', auth });
  const meta = await sheetsApi.spreadsheets.get({ spreadsheetId });
  const sheetTitles = meta.data.sheets.map(s => s.properties.title);
  console.log('Sheets found in spreadsheet:', sheetTitles);

  for (const title of sheetTitles) {
    try {
      const res = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${title}!A:A`,
      });
      const rowCount = res.data.values ? res.data.values.length : 0;
      console.log(`Sheet [${title}]: ${rowCount} total rows`);
    } catch (err) {
      console.log(`Sheet [${title}] error:`, err.message);
    }
  }
}

inspectSheets().catch(console.error);
