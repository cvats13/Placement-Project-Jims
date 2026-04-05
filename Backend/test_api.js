const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/companies',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', data.length > 100 ? data.substring(0, 100) + '...' : data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
  process.exit(1);
});

req.end();
