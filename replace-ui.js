const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-white/g, replacement: 'bg-[var(--color-gsp-surface-muted)]' },
  { regex: /text-gray-900/g, replacement: 'text-[var(--color-gsp-text-primary)]' },
  { regex: /text-gray-[56]00/g, replacement: 'text-[var(--color-gsp-text-secondary)]' },
  { regex: /border-gray-[12]00/g, replacement: 'border-[var(--color-gsp-border-muted)]' },
  { regex: /text-(indigo|purple|blue)-600/g, replacement: 'text-[var(--color-gsp-text-inverse)]' },
  { regex: /bg-(indigo|purple|blue)-600/g, replacement: 'bg-[var(--color-gsp-text-inverse)]' },
  { regex: /bg-(indigo|purple|blue)-50/g, replacement: 'bg-[#F4F1FA]' },
  { regex: /rounded-2xl/g, replacement: 'rounded-[var(--radius-2xl)]' },
  { regex: /rounded-xl/g, replacement: 'rounded-[var(--radius-xl)]' },
  { regex: /rounded-lg/g, replacement: 'rounded-[var(--radius-lg)]' },
  { regex: /shadow-sm/g, replacement: 'shadow-[var(--shadow-1)]' },
  { regex: /shadow-(md|lg)/g, replacement: 'shadow-[var(--shadow-2)]' },
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
