const fs = require('fs');
const https = require('https');
let str = "";
const req = https.request(
  {
    hostname: 'nodejs-fs-mesh-qa.apps.cluster-6bdf.6bdf.example.opentlc.com',
    port: 443,
    path: '/',
    method: 'GET',
    servername: 'nodejs-fs-mesh-qa.apps.cluster-6bdf.6bdf.example.opentlc.com',
    cert: fs.readFileSync('./ingress/certs/client/client.crt'),
    key: fs.readFileSync('./ingress/certs/client/client.key'),
    rejectUnauthorized: false
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