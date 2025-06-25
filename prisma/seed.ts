import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.account.findUnique({ where: { id: 1 } });
  if (!existing) {
    await prisma.account.create({ data: { balance: 0 } });
    console.log('Seeded Account with id=1 and balance=0');
  } else {
    console.log('Account already exists:', existing);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
