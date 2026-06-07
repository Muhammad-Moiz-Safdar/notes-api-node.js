const http = require('http');
const url = require('url');
const logger = require('./src/middleware/logger');
const { handleNotes } = require('./src/routes/notes');

const PORT = 5000;

const server = http.createServer(async (req, res) => {
  // 1. Log every incoming request
  logger(req);

  // 2. Parse the URL to get a clean pathname
  const { pathname } = url.parse(req.url);

  // 3. Route to the right handler
  if (pathname.startsWith('/api/notes')) {
    await handleNotes(req, res, pathname);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});