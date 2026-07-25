const fs = require('fs');
const path = require('path');
const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect for picsum
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      fileStream.on('error', (err) => {
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function main() {
  const publicImagesDir = path.join(__dirname, '..', 'public', 'images', 'placeholders');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  console.log("Downloading placeholder images...");
  
  // Download 10 images
  for (let i = 1; i <= 10; i++) {
    const filename = `img${i}.jpg`;
    const filepath = path.join(publicImagesDir, filename);
    if (!fs.existsSync(filepath)) {
      try {
        await downloadImage(`https://picsum.photos/seed/${i * 100}/800/600`, filepath);
        console.log(`Downloaded ${filename}`);
      } catch (err) {
        console.error(`Error downloading ${filename}:`, err);
      }
    } else {
      console.log(`${filename} already exists`);
    }
  }

  // Update homepage_settings
  console.log("Updating homepage_settings...");
  const settingsRecords = await prisma.homepage_settings.findMany();
  for (const record of settingsRecords) {
    if (record.settings) {
      let s = record.settings;
      
      // Update explore categories
      if (s.explore_categories) {
        s.explore_categories.forEach((cat, idx) => {
          cat.image = `/images/placeholders/img${(idx % 10) + 1}.jpg`;
        });
      }

      // Update subject categories
      if (s.subject_categories) {
        s.subject_categories.forEach((cat, idx) => {
          cat.image = `/images/placeholders/img${((idx + 4) % 10) + 1}.jpg`;
        });
      }

      // Update trust avatars (using smaller images)
      if (s.hero_trust_avatars) {
        s.hero_trust_avatars = s.hero_trust_avatars.map((_, idx) => `/images/placeholders/img${((idx + 7) % 10) + 1}.jpg`);
      }

      await prisma.homepage_settings.update({
        where: { id: record.id },
        data: { settings: s }
      });
    }
  }

  // Update categories
  console.log("Updating categories...");
  const categories = await prisma.categories.findMany();
  for (let i = 0; i < categories.length; i++) {
    await prisma.categories.update({
      where: { id: categories[i].id },
      data: { image: `/images/placeholders/img${(i % 10) + 1}.jpg` }
    });
  }

  // Update publications cover_image
  console.log("Updating publications...");
  const publications = await prisma.publications.findMany();
  for (let i = 0; i < publications.length; i++) {
    await prisma.publications.update({
      where: { id: publications[i].id },
      data: { cover_image: `/images/placeholders/img${((i + 3) % 10) + 1}.jpg` }
    });
  }

  console.log("Done! All images downloaded and database updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
