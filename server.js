const fs = require("fs");
const https = require("https");
const http = require("http");

const httpsServer = process.env["enablehttp"] ? false : true;
if (httpsServer === true) {
  console.log("Starting https server, requiring certs");
  https
    .createServer(
      {
        // ...
        cert: fs.readFileSync("./certs/server/tls.crt"),
        key: fs.readFileSync("./certs/server/tls.key"),
        requestCert: true,
        rejectUnauthorized: false,
        ca: fs.readFileSync("./certs/ca/ca.crt"),
        // ...
      },
      (req, res) => {
        console.log("Connection received");
        if (!req.client.authorized) {
          res.writeHead(401);
          return res.end("Invalid client certificate authentication.");
        }

        res.writeHead(200);
        res.end("Hello, world!");
      }
    )
    .listen(8443);
} else {
  console.log("Starting http server, not requiring certs");
http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
}

