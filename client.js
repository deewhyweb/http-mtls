const fs = require('fs');
const https = require('https');
let str = "";
const req = https.request(
  {
    hostname: 't-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com',
    port: 443,
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