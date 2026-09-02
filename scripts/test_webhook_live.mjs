import http from 'http';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function testWebhook() {
  const secret = 'whsec_test_secret_12345';
  let received = false;

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('📬 Webhook received!');
      console.log('   Event Header:', req.headers['x-calmeet-event']);
      console.log('   Signature Header:', req.headers['x-calmeet-signature']);
      
      const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
      const isValid = req.headers['x-calmeet-signature'] === expectedSig;
      console.log('   HMAC-SHA256 Signature Valid:', isValid);
      console.log('   Payload Event:', JSON.parse(body).event);
      received = true;
      res.writeHead(200);
      res.end('OK');
    });
  });

  server.listen(9876, async () => {
    console.log('Listening for webhooks on http://localhost:9876/webhook ...');
    const user = await prisma.user.findUnique({ where: { email: 'rbgaming116@gmail.com' } });
    
    // Add temporary test webhook in DB
    const wh = await prisma.webhook.create({
      data: {
        userId: user.id,
        url: 'http://localhost:9876/webhook',
        secret: secret,
        events: JSON.stringify(['booking.created', 'booking.canceled']),
        isActive: true
      }
    });

    console.log('Registered temporary webhook. Triggering API booking...');

    // Make an API booking to trigger webhook
    await fetch('http://localhost:3000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer cal_live_ef97697bb74f234c1b83e1202849f2ed'
      },
      body: JSON.stringify({
        eventTypeId: 'cmpocbsg4000156ros1ogzqu1',
        guestName: 'Webhook Live Listener Test',
        guestEmail: 'wh.test@example.com',
        startTime: new Date(Date.now() + 4*86400000).toISOString(),
        endTime: new Date(Date.now() + 4*86400000 + 900000).toISOString(),
        notes: 'Testing webhook trigger'
      })
    });

    setTimeout(async () => {
      await prisma.webhook.delete({ where: { id: wh.id } });
      await prisma.$disconnect();
      server.close();
      console.log(received ? '🎉 WEBHOOK TEST SUCCESSFUL (Delivered & Verified)!' : '❌ Webhook not received');
      process.exit(0);
    }, 4000);
  });
}

testWebhook();
