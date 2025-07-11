const express = require('express');
const { createServer } = require('cors-anywhere');

const app = express();

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

// Create a single shared instance of the CORS proxy
const corsProxy = createServer({
  originWhitelist: [],
  requireHeader: ['origin', 'x-requested-with', 'apikey'],
  removeHeaders: ['cookie', 'cookie2']
});

// Handle all requests through this proxy
app.use((req, res) => {
  req.headers['origin'] = req.headers['origin'] || 'http://localhost:8080';
  req.headers['x-requested-with'] = req.headers['x-requested-with'] || 'XMLHttpRequest';
  req.headers['apikey'] = req.headers['apikey'] || 'zR3bM_l5JEE41nnMrqM80w';

  corsProxy.emit('request', req, res);
});

// Listen once
app.listen(port, host, () => {
  console.log(`Raven proxy running on http://${host}:${port}`);
});
