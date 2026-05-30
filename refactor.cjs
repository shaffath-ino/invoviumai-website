const fs = require('fs');
const path = require('path');

const dirsToScan = ['src', 'server'];
const replacements = [
  { search: /'enrolled'/g, replace: "'Enrolled'" },
  { search: /"enrolled"/g, replace: '"Enrolled"' },
  { search: /'pending_verification'/g, replace: "'Pending_Verification'" },
  { search: /"pending_verification"/g, replace: '"Pending_Verification"' },
  { search: /'paid'/g, replace: "'Paid'" },
  { search: /"paid"/g, replace: '"Paid"' },
  { search: /'activated'/g, replace: "'Activated'" },
  { search: /"activated"/g, replace: '"Activated"' },
  { search: /'captured'/g, replace: "'Captured'" },
  { search: /"captured"/g, replace: '"Captured"' },
  { search: /'refunded'/g, replace: "'Refunded'" },
  { search: /"refunded"/g, replace: '"Refunded"' },
  { search: /'created'/g, replace: "'Created'" },
  { search: /"created"/g, replace: '"Created"' },
  { search: /'failed'/g, replace: "'Failed'" },
  { search: /"failed"/g, replace: '"Failed"' }
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const req of replacements) {
        if (req.search.test(content)) {
          content = content.replace(req.search, req.replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

dirsToScan.forEach(dir => scanDir(path.join(process.cwd(), dir)));
console.log('Update complete.');
