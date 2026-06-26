const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '../styles');
const globalsPath = path.join(stylesDir, 'globals.css');

const cssFilesToMerge = [
  'gsp-sections.css',
  'about.css',
  'contact.css',
  'explore.css',
  'publication-detail.css',
  'featured-content.css',
  'gsp-featured-scholars.css',
  'gsp-recent-blogs.css',
  'gsp-subject-categories.css',
  'scholar-reviews.css',
  'auth.css',
  'home-hero.css'
];

let globalsContent = fs.readFileSync(globalsPath, 'utf8');

// Remove the @import statements for these files
cssFilesToMerge.forEach(file => {
  const importRegex = new RegExp(`@import\\s+['"]\\.\\/${file}['"];?\\n?`, 'g');
  globalsContent = globalsContent.replace(importRegex, '');
});

// We want to replace hardcoded colors that match our global variables
const replacements = [
  { regex: /#2F115D/gi, replacement: 'var(--violet)' },
  { regex: /#B8893E/gi, replacement: 'var(--gold)' },
  { regex: /#F4F1FA/gi, replacement: 'var(--violet-soft)' },
  { regex: /rgba\(47,\s*17,\s*93,\s*0\.12\)/g, replacement: 'var(--violet-line)' },
  { regex: /rgba\(47,\s*17,\s*93,\s*0\.14\)/g, replacement: 'var(--violet-line)' },
  { regex: /#0A0A0A/gi, replacement: 'var(--ink)' },
  { regex: /#F8F7FC/gi, replacement: 'var(--surface)' },
  { regex: /#ECEAF4/gi, replacement: 'var(--rule)' },
  { regex: /rgba\(10,\s*10,\s*10,\s*0\.56\)/g, replacement: 'var(--ink-mid)' },
  { regex: /rgba\(10,\s*10,\s*10,\s*0\.58\)/g, replacement: 'var(--ink-mid)' },
  { regex: /rgba\(10,\s*10,\s*10,\s*0\.34\)/g, replacement: 'var(--ink-muted)' },
  { regex: /rgba\(10,\s*10,\s*10,\s*0\.36\)/g, replacement: 'var(--ink-muted)' },
  { regex: /#16A34A/gi, replacement: 'var(--success)' },
  { regex: /#DC2626/gi, replacement: 'var(--error)' }
];

let mergedCSS = '\n/* --- MERGED CSS --- */\n';

for (const file of cssFilesToMerge) {
  const filePath = path.join(stylesDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Merging ${file}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply token replacements
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    // Replace the local variables like var(--v) with global ones
    content = content.replace(/var\(--v\)/g, 'var(--violet)');
    content = content.replace(/var\(--vs\)/g, 'var(--violet-soft)');
    content = content.replace(/var\(--vl\)/g, 'var(--violet-line)');
    content = content.replace(/var\(--ink\)/g, 'var(--ink)');
    content = content.replace(/var\(--mid\)/g, 'var(--ink-mid)');
    content = content.replace(/var\(--muted\)/g, 'var(--ink-muted)');
    content = content.replace(/var\(--rule\)/g, 'var(--rule)');
    content = content.replace(/var\(--surf\)/g, 'var(--surface)');
    content = content.replace(/var\(--ok\)/g, 'var(--success)');
    content = content.replace(/var\(--err\)/g, 'var(--error)');
    
    // Replace layout variables
    content = content.replace(/var\(--max\)/g, '1280px');
    content = content.replace(/var\(--px\)/g, '56px');
    content = content.replace(/var\(--sbw\)/g, '284px');

    mergedCSS += `\n/* --- ${file} --- */\n` + content;
  }
}

globalsContent += mergedCSS;

fs.writeFileSync(globalsPath, globalsContent, 'utf8');
console.log('Successfully consolidated CSS into globals.css');
