const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-gray-[78]00/g, replacement: 'text-[var(--color-gsp-text-primary)]' },
  { regex: /border-gray-[34]00/g, replacement: 'border-[var(--color-gsp-border-default)]' },
  { regex: /bg-gray-50/g, replacement: 'bg-[var(--color-gsp-surface-raised)]' },
  { regex: /text-gray-400/g, replacement: 'text-[var(--color-gsp-text-secondary)]' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const dirsToProcess = ['app/dashboard', 'app/library'];
let files = [];
dirsToProcess.forEach(dir => {
  files = files.concat(walk(path.join(__dirname, dir)));
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
