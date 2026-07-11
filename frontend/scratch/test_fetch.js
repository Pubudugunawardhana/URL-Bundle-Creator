const http = require('http');

http.get('http://localhost:3001/edit/iMHQo', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    if (res.statusCode === 307 || res.statusCode === 308 || res.statusCode === 301 || res.statusCode === 302) {
      console.log('Redirecting to:', res.headers.location);
    }
    if (res.statusCode >= 400) {
      console.log('Response excerpt:', data.substring(0, 1000));
    }
  });
}).on('error', err => console.error(err));
