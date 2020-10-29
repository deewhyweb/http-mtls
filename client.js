const fs = require('fs');
const https = require('https');
let str = "";
const req = https.request(
  {
    hostname: 'localhost',
    port: 9443,
    path: '/',
    method: 'GET',

    cert: fs.readFileSync('./certs/client/client.crt'),
    key: fs.readFileSync('./certs/client/client.key'),
    ca: fs.readFileSync('./certs/ca/ca.crt')
  },
  response => {
    response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        console.log(str);
      });
  }
);

req.end();