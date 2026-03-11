const https = require('https');
https.request('https://bdjob.mrdurjoy.workers.dev/posts', { method: 'OPTIONS' }, (res) => {
  console.log(res.statusCode);
  console.log(res.headers);
}).end();
