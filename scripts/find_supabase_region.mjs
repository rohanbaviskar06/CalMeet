import { PrismaClient } from '@prisma/client';

const projectRef = 'vpbbvxyleufhtoiyhprt';
const password = 'dbcalmeet%40supabase06';

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'ca-central-1',
  'sa-east-1'
];

async function testRegion(r) {
  const url = `postgresql://postgres.${projectRef}:${password}@aws-0-${r}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`;
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });

  try {
    const userCount = await prisma.user.count();
    console.log(`\n🎉 FOUND MATCHING REGION: ${r}`);
    console.log(`   Working Pooler DATABASE_URL:`);
    console.log(`   postgresql://postgres.${projectRef}:${password}@aws-0-${r}.pooler.supabase.com:6543/postgres?pgbouncer=true\n`);
    await prisma.$disconnect();
    return true;
  } catch (err) {
    if (err.message.includes('tenant/user') && err.message.includes('not found')) {
      // not this region
    } else {
      console.log(`   Region ${r} returned:`, err.message.slice(0, 100));
    }
    await prisma.$disconnect().catch(() => {});
    return false;
  }
}

async function findRegion() {
  console.log(`Testing regions for Supabase project "${projectRef}"...`);
  for (const r of regions) {
    process.stdout.write(`Trying ${r}... `);
    const success = await testRegion(r);
    if (success) {
      process.exit(0);
    }
  }
  console.log('\nCould not find matching pooler region automatically.');
}

findRegion();
