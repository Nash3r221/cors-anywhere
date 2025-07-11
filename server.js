const express = require('express');
const corsAnywhere = require('./lib/cors-anywhere');

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

// Create the proxy server
const proxy = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with', 'apikey'],
  removeHeaders: [
    'cookie', 'cookie2',
    'x-request-start', 'x-request-id', 'via',
    'connect-time', 'total-route-time'
  ],
});

// Mount CORS proxy at `/fetch/:encodedUrl`
app.use('/fetch', (req, res) => {
  const encodedUrl = req.url.slice(1); // Remove initial `/`
  req.url = decodeURIComponent(encodedUrl);
  proxy.emit('request', req, res);
});

// Start server
app.listen(port, host, () => {
  console.log(`CORS Proxy running at http://${host}:${port}`);
});
