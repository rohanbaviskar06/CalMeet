import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.vpbbvxyleufhtoiyhprt:dbcalmeet%40supabase06@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
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
