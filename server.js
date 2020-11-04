const fs = require('fs');
const https = require('https');
console.log('starting server');
https
  .createServer(
    {
      // ...
      cert: fs.readFileSync('./certs/server/tls.crt'),
      key: fs.readFileSync('./certs/server/tls.key'),
      requestCert: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync('./certs/ca/ca.crt')
      // ...
    },
    (req, res) => {
       console.log('Connection received');
      if (!req.client.authorized) {
        res.writeHead(401);
        return res.end('Invalid client certificate authentication.');
      }

      res.writeHead(200);
      res.end('Hello, world!');
    }
  )
  .listen(8443);