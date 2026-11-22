import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url,
    }
  }
});

async function test() {
  try {
    const count = await prisma.user.count();
    console.log('✅ SUCCESS! Connected via Transaction Pooler. User count:', count);
  } catch (e) {
    console.log('❌ FAILED:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
