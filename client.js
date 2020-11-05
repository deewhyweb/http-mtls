const fs = require('fs');
const https = require('https');
let str = "";
const req = https.request(
  {
    hostname: 'http-mtls.apps.cluster-6c24.6c24.example.opentlc.com',
    port: 443,
    path: '/',
    method: 'GET',
    servername: 'http-mtls.apps.cluster-6c24.6c24.example.opentlc.com',
    cert: fs.readFileSync('./ingress/certs/client/client.crt'),
    key: fs.readFileSync('./ingress/certs/client/client.key'),
    ca: fs.readFileSync('./ingress/certs/ca/ca.crt'),
    rejectUnauthorized: true
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