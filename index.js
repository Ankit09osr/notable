/*
 * Primary file for API
 */


// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const handlers = require('./handlers.js');
const helpers = require('./helpers.js');

// Instantiate the HTTP server
const server = http.createServer(function(req, res) {
  serverLogic(req, res);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log("The server is listening on port:"+ 3000 +" now!");
});

// Add server logic here
const serverLogic = function(req,res) {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the URL
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf8');
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();
    // Choose the handler this request should go to. If one is not found, use the notFound handler
    const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method': method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    choosenHandler(data, function(statusCode, payload){
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};


// Define a request router
const router = {
  'ping' : handlers.ping,
  'doctor' : handlers.doctor,
  'appointment' : handlers.appointment
};
