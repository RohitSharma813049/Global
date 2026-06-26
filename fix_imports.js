const fs = require('fs');
const path = require('path');

const mappings = {
  // Scholars
  "@/components/GSPDistinguishedScholars": "@/components/scholars/GSPDistinguishedScholars",
  "@/components/ScholarReviewsCarousel": "@/components/scholars/ScholarReviewsCarousel",
  "@/components/featured-scholars": "@/components/scholars/featured-scholars",
  "@/components/gsp-featured-scholars": "@/components/scholars/gsp-featured-scholars",

  // Home
  "@/components/home-hero": "@/components/home/home-hero",
  "@/components/gsp-explore-categories": "@/components/home/gsp-explore-categories",
  "@/components/gsp-featured-content": "@/components/home/gsp-featured-content",
  "@/components/gsp-recent-blogs": "@/components/home/gsp-recent-blogs",
  "@/components/gsp-subject-categories": "@/components/home/gsp-subject-categories",
  "@/components/featured-content": "@/components/home/featured-content",
  "@/components/explore-categories": "@/components/home/explore-categories",

  // Layout
  "@/components/header": "@/components/layout/header",
  "@/components/footer": "@/components/layout/footer",
  "@/components/dashboard-layout-wrapper": "@/components/layout/dashboard-layout-wrapper",
  "@/components/dashboard-mobile-sidebar": "@/components/layout/dashboard-mobile-sidebar",
  "@/components/dashboard-sidebar": "@/components/layout/dashboard-sidebar",
  "@/components/dashboard-bottom-nav": "@/components/layout/dashboard-bottom-nav",

  // Shared
  "@/components/cta-banner": "@/components/shared/cta-banner",
  "@/components/faq-section": "@/components/shared/faq-section",
  "@/components/how-it-works": "@/components/shared/how-it-works",
  "@/components/testimonials": "@/components/shared/testimonials",
  "@/components/statistics": "@/components/shared/statistics",
  "@/components/scroll-animation": "@/components/shared/scroll-animation",
  "@/components/recent-news-blogs": "@/components/shared/recent-news-blogs"
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [oldPath, newPath] of Object.entries(mappings)) {
    // Replace standard imports
    const regex = new RegExp(`from ['"]${oldPath}['"]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `from "${newPath}"`);
      changed = true;
    }
    // Replace dynamic imports e.g. import('@/components/...')
    const dynRegex = new RegExp(`import\\(['"]${oldPath}['"]\\)`, 'g');
    if (dynRegex.test(content)) {
      content = content.replace(dynRegex, `import("${newPath}")`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Process app/ and components/
['app', 'components'].forEach(dir => {
  walkDir(path.join(__dirname, dir), processFile);
});

console.log("Done updating imports.");
