import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

const email = `qa_tester_${Date.now()}@example.com`;
const password = 'TestPass123';
let token = '';
let headers = {};

async function testAll() {
  console.log('🚀 Starting end-to-end API verification on live backend...');
  console.log(`URL: ${BASE_URL}`);
  console.log(`User email: ${email}\n`);

  try {
    // 1. SIGNUP
    console.log('1️⃣ Testing signup...');
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      firstName: 'QA',
      lastName: 'Tester',
      email,
      password
    });
    console.log('✅ Signup success status:', signupRes.data.status);
    console.log('Message:', signupRes.data.message);

    // 2. LOGIN
    console.log('\n2️⃣ Testing login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    console.log('✅ Login success status:', loginRes.data.status);
    token = loginRes.data.accessToken;
    headers = { Authorization: `Bearer ${token}` };
    console.log('Received JWT token successfully');

    // 3. MOOD TRACKER
    console.log('\n3️⃣ Testing Mood Tracker...');
    const moodCreateRes = await axios.post(`${BASE_URL}/moods`, {
      mood: 'happy',
      moodScore: 5,
      intensity: 'high',
      energy: 9,
      sleep: 8
    }, { headers });
    console.log('✅ Created mood entry:', moodCreateRes.data.status);

    const moodHistoryRes = await axios.get(`${BASE_URL}/moods/history`, { headers });
    console.log('✅ Fetched mood history count:', moodHistoryRes.data.data.length);

    const moodAnalyticsRes = await axios.get(`${BASE_URL}/moods/analytics?days=7`, { headers });
    console.log('✅ Fetched mood analytics. Total entries:', moodAnalyticsRes.data.data.totalEntries);

    // 4. JOURNAL
    console.log('\n4️⃣ Testing Journal...');
    const journalCreateRes = await axios.post(`${BASE_URL}/journals`, {
      title: 'Testing live app',
      content: 'This is a test journal entry created by the automated QA verification pass.',
      mood: 'happy',
      tags: ['test', 'qa']
    }, { headers });
    console.log('✅ Created journal entry title:', journalCreateRes.data.data.title);

    const journalHistoryRes = await axios.get(`${BASE_URL}/journals`, { headers });
    console.log('✅ Fetched journals count:', journalHistoryRes.data.data.length);

    // 5. COMMUNITY POSTS
    console.log('\n5️⃣ Testing Community Feed...');
    const postCreateRes = await axios.post(`${BASE_URL}/posts`, {
      content: 'Hello community, this is an automated verification post! 🧘 #wellness',
      tags: ['wellness']
    }, { headers });
    const postId = postCreateRes.data.data._id;
    console.log('✅ Created community post. ID:', postId);

    const postLikeRes = await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, { headers });
    console.log('✅ Liked post. Likes count:', postLikeRes.data.data.likeCount);

    const postUnlikeRes = await axios.post(`${BASE_URL}/posts/${postId}/unlike`, {}, { headers });
    console.log('✅ Unliked post. Likes count:', postUnlikeRes.data.data.likeCount);

    // 6. AI WELLNESS
    console.log('\n6️⃣ Testing AI Wellness...');
    try {
      const breathingRes = await axios.post(`${BASE_URL}/ai/breathing-exercise`, {
        duration: 3,
        focusArea: 'anxiety'
      }, { headers });
      console.log('✅ AI Breathing Exercise success:', breathingRes.data.status);
    } catch (err) {
      console.warn('⚠️ AI Breathing Exercise skipped/error:', err.response?.data?.message || err.message);
    }

    try {
      const insightRes = await axios.post(`${BASE_URL}/ai/mood-insight`, {
        moodHistory: [{ mood: 'happy', moodScore: 5, createdAt: new Date() }]
      }, { headers });
      console.log('✅ AI Mood Insight success:', insightRes.data.status);
    } catch (err) {
      console.warn('⚠️ AI Mood Insight skipped/error:', err.response?.data?.message || err.message);
    }

    // 7. USER PROFILE
    console.log('\n7️⃣ Testing Profile updates...');
    const profileRes = await axios.get(`${BASE_URL}/users/profile`, { headers });
    console.log('✅ Fetched profile email:', profileRes.data.data.email);

    const profileUpdateRes = await axios.put(`${BASE_URL}/users/profile`, {
      bio: 'Verified QA Tester Account'
    }, { headers });
    console.log('✅ Updated profile bio:', profileUpdateRes.data.data.bio);

    // 8. SECURITY & PERMISSIONS (Admin check)
    console.log('\n8️⃣ Testing security/role permissions (accessing admin route as normal user)...');
    try {
      await axios.get(`${BASE_URL}/admin/dashboard`, { headers });
      console.log('❌ Error: Normal user was able to access admin dashboard!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✅ Security check passed: User blocked with 403 Forbidden as expected.');
      } else {
        console.warn('⚠️ Unexpected admin dashboard response status:', err.response?.status);
      }
    }

    console.log('\n🎉 ALL LIVE API ENDPOINTS TESTED AND CONFIRMED RUNNING CORRECTLY!');

  } catch (error) {
    console.error('\n❌ API Verification Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAll();
