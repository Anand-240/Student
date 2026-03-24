const http = require('http');
const querystring = require('querystring');

const postData = querystring.stringify({
  email: 'testauth@example.com',
  password: 'password123',
  redirect: 'false',
  csrfToken: 'whatever', // This usually depends on NextAuth having an active session, so doing it directly is tricky
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/callback/credentials',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', chunk => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', e => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
