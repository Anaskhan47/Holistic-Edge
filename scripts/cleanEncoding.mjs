import fs from 'node:fs';
import path from 'node:path';

const REPLACEMENTS = [
  // Mojibake to Clean Unicode
  { search: /â€¦/g, replace: '...' },
  { search: /â€“/g, replace: '–' },
  { search: /â€”/g, replace: '—' },
  { search: /â†’/g, replace: '→' },
  { search: /â† /g, replace: '←' },
  { search: /â„¢/g, replace: '™' },
  { search: /â­ /g, replace: '★' },
  { search: /â˜…/g, replace: '★' },
  { search: /âš ï¸ /g, replace: '⚠️' },
  { search: /âœ‰ï¸ /g, replace: '✉️' },
  { search: /ðŸ“ž/g, replace: '📞' },
  { search: /ðŸŒ /g, replace: '🌐' },
  { search: /Ã—/g, replace: '×' },
  { search: /Â·/g, replace: '·' },
  { search: /Â /g, replace: ' ' },
];

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  for (const { search, replace } of REPLACEMENTS) {
    updated = updated.replace(search, replace);
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Cleaned: ${filePath}`);
    return 1;
  }
  return 0;
}

function walkDir(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walkDir(fullPath);
    } else if (/\.(ts|tsx|js|jsx|json|html|css|md)$/i.test(entry.name)) {
      count += processFile(fullPath);
    }
  }
  return count;
}

const root = process.cwd();
console.log('Scanning and cleaning UTF-8 encoding in:', root);
let total = 0;
total += walkDir(path.join(root, 'src'));
total += walkDir(path.join(root, 'server'));
console.log(`Total files cleaned: ${total}`);
