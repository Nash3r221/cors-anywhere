const express = require('express');
const cors_proxy = require('cors-anywhere');

const app = express();
const port = process.env.PORT || 8080;

const originWhitelist = []; // Allow all origins

app.get('/', (req, res) => {
  res.send('🟢 Raven CORS Proxy is running.');
});

app.use('/', (req, res) => {
  req.headers['origin'] = req.headers['origin'] || 'http://localhost:8080';
  req.headers['x-requested-with'] = req.headers['x-requested-with'] || 'XMLHttpRequest';
  req.headers['apikey'] = req.headers['apikey'] || 'zR3bM_l5JEE41nnMrqM80w';
  cors_proxy.createServer({
    originWhitelist,
    requireHeader: ['origin', 'x-requested-with', 'apikey'],
    removeHeaders: ['cookie', 'cookie2']
  }).emit('request', req, res);
});

app.listen(port, () => {
  console.log(`CORS Anywhere proxy running on port ${port}`);
});
