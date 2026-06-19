const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('app');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('new PrismaClient()')) {
    // Replace the exact matching lines:
    // import { PrismaClient } from '@prisma/client'
    // const prisma = new PrismaClient()
    // with: import { prisma } from '@/lib/db'
    
    // First try replacing when they are together
    let newC = c.replace(/import\s+\{\s*PrismaClient\s*\}\s+from\s+['"]@prisma\/client['"];?\r?\n\s*const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, "import { prisma } from '@/lib/db'");
    
    if (newC === c) {
      // Try just replacing `const prisma = new PrismaClient()` 
      // if `@prisma/client` is around
      newC = c.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, "import { prisma } from '@/lib/db'");
      // Also remove the import PrismaClient if it's there
      newC = newC.replace(/import\s+\{\s*PrismaClient\s*\}\s+from\s+['"]@prisma\/client['"];?/g, "");
    }
    
    fs.writeFileSync(f, newC);
    console.log('Fixed', f);
  }
});
