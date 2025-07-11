var cors_proxy = require('./lib/cors-anywhere');

// Optional: configure whitelist/blacklist via environment
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

var originBlacklist = [];
var originWhitelist = [];

cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with', 'apikey'], // if needed
  removeHeaders: [
    'cookie', 'cookie2'
  ]
}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
