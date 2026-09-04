import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Known mojibake / corrupted UTF-8 patterns
const MOJIBAKE_PATTERNS = [
  /â€¦/,   // corrupted ellipsis
  /â€“/,   // corrupted en-dash
  /â€”/,   // corrupted em-dash
  /â€/,    // general â€ mojibake prefix
  /â€™/,   // corrupted right single quote / apostrophe
  /â€˜/,   // corrupted left single quote
  /â€œ/,   // corrupted left double quote
  /â€\x9d/, // corrupted right double quote
  /â„¢/,   // corrupted trademark symbol
  /âš /,   // corrupted warning symbol
  /âœ‰/,   // corrupted envelope symbol
  /Ã—/,    // corrupted multiplication sign
  /Â·/,    // corrupted middle dot
  /ðŸ/,    // double-encoded emoji prefix
];

function scanDirectory(dir, violations = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.system_generated') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, violations);
    } else if (/\.(ts|tsx|js|mjs|json|html|css)$/i.test(entry.name)) {
      // Don't scan the test file itself or the cleaner script
      if (entry.name === 'checkEncoding.test.mjs' || entry.name === 'cleanEncoding.mjs') {
        continue;
      }
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        for (const pattern of MOJIBAKE_PATTERNS) {
          if (pattern.test(line)) {
            violations.push({
              file: path.relative(process.cwd(), fullPath),
              line: index + 1,
              pattern: pattern.toString(),
              snippet: line.trim().slice(0, 100),
            });
            break;
          }
        }
      });
    }
  }
  return violations;
}

test('HE-QA-04: Static source files and data must contain zero corrupted UTF-8 / mojibake artifacts', () => {
  const root = process.cwd();
  const srcViolations = scanDirectory(path.join(root, 'src'));
  const serverViolations = scanDirectory(path.join(root, 'server'));
  const allViolations = [...srcViolations, ...serverViolations];

  if (allViolations.length > 0) {
    console.error('Encoding violations detected:');
    allViolations.forEach(v => {
      console.error(`  - ${v.file}:${v.line} matches ${v.pattern}: "${v.snippet}"`);
    });
  }

  assert.strictEqual(
    allViolations.length,
    0,
    `Found ${allViolations.length} encoding violation(s). All source files must be clean UTF-8.`
  );
});
