const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultScholars = [
  {
    name: "Dr. Priya Nair-Kapoor",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "India",
    countryFlag: "🇮🇳",
    credential: "Hon. D.B.A. · Sustainable Finance",
    institution: "Indian Institute of Management, Ahmedabad",
    field: "ESG & Finance",
    username: "priya-nair",
    email: "priya.nair@global.com",
    publications: 42
  },
  {
    name: "Dr. Ngozi Adeyemi",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    credential: "Ph.D., FAAN · Knowledge Systems",
    institution: "University of Lagos, Faculty of Arts",
    field: "Social Sciences",
    username: "ngozi-adeyemi",
    email: "ngozi.adeyemi@global.com",
    publications: 37
  },
  {
    name: "Dr. Amira Al-Rashidi",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "UAE",
    countryFlag: "🇦🇪",
    credential: "Hon. D.Sc. · Climate Policy",
    institution: "Zayed University, School of Public Policy",
    field: "Climate & Policy",
    username: "amira-alrashidi",
    email: "amira.alrashidi@global.com",
    publications: 29
  },
  {
    name: "Prof. Khalid Al-Mansouri",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Saudi Arabia",
    countryFlag: "🇸🇦",
    credential: "Hon. D.B.A. · Economic Diversification",
    institution: "King Saud University, College of Business",
    field: "Economics",
    username: "khalid-almansouri",
    email: "khalid.almansouri@global.com",
    publications: 51
  },
  {
    name: "Prof. Li Wei",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "China",
    countryFlag: "🇨🇳",
    credential: "Ph.D. · AI Ethics",
    institution: "Tsinghua University, School of Computing",
    field: "AI & Ethics",
    username: "li-wei",
    email: "li.wei@global.com",
    publications: 33
  },
  {
    name: "Dr. Carlos Mendieta",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Mexico",
    countryFlag: "🇲🇽",
    credential: "Hon. D.Litt. · Comparative Linguistics",
    institution: "UNAM, Institute of Philological Research",
    field: "Linguistics",
    username: "carlos-mendieta",
    email: "carlos.mendieta@global.com",
    publications: 26
  },
  {
    name: "Dr. Hana Kobayashi",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Japan",
    countryFlag: "🇯🇵",
    credential: "Ph.D. · Renewable Materials",
    institution: "University of Tokyo, Dept. of Engineering",
    field: "Materials Sci.",
    username: "hana-kobayashi",
    email: "hana.kobayashi@global.com",
    publications: 39
  },
  {
    name: "Prof. Elena Marchetti",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Italy",
    countryFlag: "🇮🇹",
    credential: "Hon. D.Sc. · Public Health Policy",
    institution: "Bocconi University, School of Government",
    field: "Public Health",
    username: "elena-marchetti",
    email: "elena.marchetti@global.com",
    publications: 44
  }
];

// Helper to create UUID
function generateUUID() {
  return require('crypto').randomUUID();
}

async function main() {
  console.log('Seeding fake featured scholars...');
  
  for (const s of defaultScholars) {
    const userId = generateUUID();
    
    // Create user
    await prisma.users.create({
      data: {
        id: userId,
        email: s.email,
        raw_user_meta_data: {
          name: s.name,
          avatar_url: s.image,
          country: s.country,
          countryFlag: s.countryFlag
        }
      }
    });

    // Create scholar profile
    const scholar = await prisma.scholars.create({
      data: {
        user_id: userId,
        username: s.username,
        institution: s.institution,
        qualification: s.credential,
        specialization: s.field,
        is_featured: true,
        verified: true,
        total_views: Math.floor(Math.random() * 5000) + 1000
      }
    });

    console.log(`Created ${s.name}`);

    // Create fake publications
    for (let i = 0; i < s.publications; i++) {
      await prisma.publications.create({
        data: {
          scholar_id: scholar.id,
          title: `Research paper by ${s.name} ${i+1}`,
          abstract: `This is a simulated research abstract for a paper written by ${s.name}. It explores interesting topics in ${s.field}.`,
          content_type: "Article",
          file_url: "#",
          author_name: s.name,
          institution: s.institution,
          status: "published",
          views: Math.floor(Math.random() * 500)
        }
      });
    }
  }

  console.log('Done seeding scholars!');
}

main().catch(e => {
  console.error(e);
}).finally(() => {
  prisma.$disconnect();
});
