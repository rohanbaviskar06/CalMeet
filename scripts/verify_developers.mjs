import http from 'http';

const API_KEY = 'cal_live_ef97697bb74f234c1b83e1202849f2ed';
const BASE_URL = 'http://localhost:3000';

async function runAllTests() {
  console.log('==============================================');
  console.log('🧪 CALMEET DEVELOPER API & WEBHOOK TEST SUITE');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  // Helper for requests
  const apiRequest = async (method, path, body = null, token = API_KEY) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  };

  // TEST 1: GET /api/v1/me
  try {
    console.log('👉 [TEST 1] GET /api/v1/me (Authentication & Profile)...');
    const { status, data } = await apiRequest('GET', '/api/v1/me');
    if (status === 200 && data.success && data.data.email === 'rbgaming116@gmail.com') {
      console.log('   ✅ PASSED: User profile retrieved successfully!');
      console.log(`      User: ${data.data.name} (${data.data.username})`);
      console.log(`      Plan: ${data.data.plan}, Bookings: ${data.data.stats.totalBookings}`);
      passed++;
    } else {
      console.error('   ❌ FAILED:', status, data);
      failed++;
    }
  } catch (e) {
    console.error('   ❌ FAILED with exception:', e.message);
    failed++;
  }

  // TEST 2: GET /api/v1/event-types
  let testEventTypeId = null;
  try {
    console.log('\n👉 [TEST 2] GET /api/v1/event-types (List active event types)...');
    const { status, data } = await apiRequest('GET', '/api/v1/event-types');
    if (status === 200 && data.success && Array.isArray(data.data)) {
      console.log(`   ✅ PASSED: Retrieved ${data.data.length} event type(s)!`);
      data.data.forEach((et, i) => {
        console.log(`      ${i + 1}. [${et.slug}] ${et.title} (${et.duration} mins) - ID: ${et.id}`);
      });
      if (data.data.length > 0) testEventTypeId = data.data[0].id;
      passed++;
    } else {
      console.error('   ❌ FAILED:', status, data);
      failed++;
    }
  } catch (e) {
    console.error('   ❌ FAILED with exception:', e.message);
    failed++;
  }

  // TEST 3: GET /api/v1/bookings
  try {
    console.log('\n👉 [TEST 3] GET /api/v1/bookings (List confirmed bookings)...');
    const { status, data } = await apiRequest('GET', '/api/v1/bookings');
    if (status === 200 && data.success && Array.isArray(data.data)) {
      console.log(`   ✅ PASSED: Retrieved ${data.data.length} booking(s)!`);
      if (data.data.length > 0) {
        const first = data.data[0];
        console.log(`      Latest booking: ${first.guestName} (${first.guestEmail}) on ${first.eventType.title}`);
      }
      passed++;
    } else {
      console.error('   ❌ FAILED:', status, data);
      failed++;
    }
  } catch (e) {
    console.error('   ❌ FAILED with exception:', e.message);
    failed++;
  }

  // TEST 4: POST /api/v1/bookings (Create a programmatic booking via API)
  if (testEventTypeId) {
    try {
      console.log('\n👉 [TEST 4] POST /api/v1/bookings (Programmatic booking creation)...');
      const start = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now at 14:00
      start.setHours(14, 0, 0, 0);
      const end = new Date(start.getTime() + 15 * 60 * 1000);

      const bookingPayload = {
        eventTypeId: testEventTypeId,
        guestName: 'API Test Agent',
        guestEmail: 'agent.test@example.com',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        notes: 'Automated test booking via CalMeet REST API v1',
      };

      const { status, data } = await apiRequest('POST', '/api/v1/bookings', bookingPayload);
      if (status === 201 && data.success && data.data.id) {
        console.log('   ✅ PASSED: Programmatic booking created successfully!');
        console.log(`      Booking ID: ${data.data.id}`);
        console.log(`      Guest: ${data.data.guestName} <${data.data.guestEmail}>`);
        console.log(`      Time: ${data.data.startTime}`);
        passed++;
      } else {
        console.error('   ❌ FAILED:', status, data);
        failed++;
      }
    } catch (e) {
      console.error('   ❌ FAILED with exception:', e.message);
      failed++;
    }
  }

  // TEST 5: Security Test (Invalid API Key -> 401 Unauthorized)
  try {
    console.log('\n👉 [TEST 5] Security Check (Testing Invalid API Key)...');
    const { status, data } = await apiRequest('GET', '/api/v1/me', null, 'cal_live_invalid_token_123');
    if (status === 401 && data.error) {
      console.log('   ✅ PASSED: Correctly blocked unauthorized request (HTTP 401 Unauthorized)!');
      console.log(`      Error message: "${data.error}"`);
      passed++;
    } else {
      console.error('   ❌ FAILED: Security check should return 401 Unauthorized!', status, data);
      failed++;
    }
  } catch (e) {
    console.error('   ❌ FAILED with exception:', e.message);
    failed++;
  }

  console.log('\n==============================================');
  console.log(`📊 FINAL RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('==============================================\n');
}

runAllTests();
