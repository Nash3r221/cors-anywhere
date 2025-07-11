const http = require('http');
const cors_proxy = require('./lib/cors-anywhere');

// Environment variables
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

// Origin whitelist/blacklist
function parseEnvList(env) {
  return env ? env.split(',') : [];
}
const originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
const originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
const checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

// Start proxy server instance
const proxy = cors_proxy.createServer({
  originBlacklist,
  originWhitelist,
  requireHeader: ['origin', 'x-requested-with', 'apikey'],
  checkRateLimit,
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
});

// Custom route handler for /fetch/
http.createServer((req, res) => {
  if (req.url.startsWith('/fetch/')) {
    // Strip `/fetch` from URL before passing to proxy
    req.url = req.url.replace(/^\/fetch/, '');
    proxy.emit('request', req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(port, host, () => {
  console.log(`Running CORS Anywhere on ${host}:${port}`);
});
