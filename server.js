const express = require('express');
const cors_proxy = require('cors-anywhere');

const cors_proxy = require("cors-anywhere");

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

cors_proxy.createServer({
  originWhitelist: [], // allow all origins
  requireHeader: ['origin', 'x-requested-with', 'apikey'], // required headers
  removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
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
