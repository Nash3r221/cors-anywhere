// server.js

// Setup: Host and Port
const http = require('http');
const cors_proxy = require('./lib/cors-anywhere');
const checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

function parseEnvList(env) {
  if (!env) return [];
  return env.split(',');
}

const originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
const originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);

// Main Server with "/fetch/" support
http.createServer(function (req, res) {
  // Rewrite any "/fetch/https://..." requests to "/https://..."
  if (req.url.startsWith('/fetch/')) {
    req.url = req.url.replace(/^\/fetch/, '');
  }

  cors_proxy.createServer({
    originBlacklist: originBlacklist,
    originWhitelist: originWhitelist,
    requireHeader: ['origin', 'x-requested-with', 'apikey'],
    checkRateLimit: checkRateLimit,
    removeHeaders: [
      'cookie',
      'cookie2',
      'x-request-start',
      'x-request-id',
      'via',
      'connect-time',
      'total-route-time',
    ],
    redirectSameOrigin: true,
    httpProxyOptions: {
      xfwd: false,
    },
  }).emit('request', req, res);
}).listen(port, host, function () {
  console.log('✅ Running CORS Anywhere with /fetch support on ' + host + ':' + port);
});
