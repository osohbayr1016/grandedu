// GrandEdu Deployment Debug Script
// Copy and paste this into your browser console on the deployed frontend

console.log('🔍 GrandEdu Deployment Debug Script');
console.log('=====================================');

// Test 1: Check current environment
console.log('\n📍 Current Environment:');
console.log('- Window location:', window.location.href);
console.log('- Hostname:', window.location.hostname);
console.log('- Protocol:', window.location.protocol);
console.log('- NODE_ENV:', process?.env?.NODE_ENV || 'Not set');

// Test 2: Check localStorage
console.log('\n🔐 Authentication Status:');
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
console.log('- Token present:', !!token);
console.log('- User present:', !!user);
if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('- User role:', userData.role);
    console.log('- User email:', userData.email);
  } catch (e) {
    console.log('- User data parsing failed:', e.message);
  }
}

// Test 3: Check API URL determination
console.log('\n🌐 API Configuration:');
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isDevelopment = process?.env?.NODE_ENV === 'development';
console.log('- Is localhost:', isLocalhost);
console.log('- Is development:', isDevelopment);

// Determine API URL (mimicking frontend logic)
let apiUrl;
if (!isLocalhost) {
  apiUrl = 'https://grandedu-g5yo.onrender.com';
  console.log('- Using production API (deployed):', apiUrl);
} else if (isDevelopment) {
  apiUrl = 'http://localhost:5001';
  console.log('- Using development API:', apiUrl);
} else {
  apiUrl = 'https://grandedu-g5yo.onrender.com';
  console.log('- Using production API (default):', apiUrl);
}

// Test 4: Backend connectivity
console.log('\n🔌 Backend Connectivity Test:');
const healthUrl = `${apiUrl}/api/health`;
console.log('- Testing URL:', healthUrl);

fetch(healthUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  signal: AbortSignal.timeout(10000)
})
.then(response => {
  console.log('✅ Backend Response:');
  console.log('- Status:', response.status);
  console.log('- OK:', response.ok);
  console.log('- Headers:', Object.fromEntries(response.headers));
  return response.json();
})
.then(data => {
  console.log('- Response data:', data);
})
.catch(error => {
  console.log('❌ Backend Error:');
  console.log('- Error:', error.message);
  console.log('- Type:', error.constructor.name);
});

// Test 5: CORS Test with authentication header
console.log('\n🛡️ CORS Test (with auth header):');
const authTestUrl = `${apiUrl}/api/auth/stats`;
console.log('- Testing URL:', authTestUrl);

if (token) {
  fetch(authTestUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    signal: AbortSignal.timeout(10000)
  })
  .then(response => {
    console.log('✅ Auth Test Response:');
    console.log('- Status:', response.status);
    console.log('- OK:', response.ok);
    if (!response.ok) {
      return response.text().then(text => {
        console.log('- Error response:', text);
      });
    }
    return response.json();
  })
  .then(data => {
    if (data) {
      console.log('- Auth test data:', data);
    }
  })
  .catch(error => {
    console.log('❌ Auth Test Error:');
    console.log('- Error:', error.message);
    console.log('- Type:', error.constructor.name);
  });
} else {
  console.log('- Skipped (no token available)');
}

console.log('\n🎯 Recommendations:');
console.log('1. If backend test fails: Check if backend is deployed and running');
console.log('2. If CORS errors: Backend needs to allow your frontend domain');
console.log('3. If auth test fails: Try logging in again or check token validity');
console.log('4. Check browser network tab for detailed error information');
