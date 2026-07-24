const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.publications.findMany({ select: { content_type: true }, take: 10 }).then(console.log).finally(() => prisma.$disconnect());
