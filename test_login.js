const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/login', {
      email: 'hardikdhawan9311@gmail.com',
      password: '12345',
      role: 'placement_officer'
    });
    console.log('Login Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Login Failed (Response):', error.response.status, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Login Failed (Error):', error.message);
    }
  }
}

testLogin();
