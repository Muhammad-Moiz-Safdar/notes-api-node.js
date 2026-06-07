const db = require('../data/notes');

// Helper — sends a JSON response and ends the connection
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Helper — collects body chunks from POST/PUT requests
const getBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
};

const handleNotes = async (req, res, pathname) => {
  const parts = pathname.split('/');
  // '/api/notes'   → ['', 'api', 'notes']        → parts[3] = undefined
  // '/api/notes/1' → ['', 'api', 'notes', '1']   → parts[3] = '1'
  const id = parts[3] ? parseInt(parts[3]) : null;

  // GET /api/notes — get all
  if (req.method === 'GET' && !id) {
    const notes = db.getAll();
    return sendJSON(res, 200, { success: true, count: notes.length, data: notes });
  }

  // GET /api/notes/:id — get one
  if (req.method === 'GET' && id) {
    const note = db.getById(id);
    if (!note) return sendJSON(res, 404, { success: false, error: 'Note not found' });
    return sendJSON(res, 200, { success: true, data: note });
  }

  // POST /api/notes — create
  if (req.method === 'POST' && !id) {
    const { title, body } = await getBody(req);
    if (!title || !body) {
      return sendJSON(res, 400, { success: false, error: 'Title and body are required' });
    }
    const note = db.create(title, body);
    return sendJSON(res, 201, { success: true, data: note });
  }

  // PUT /api/notes/:id — update
  if (req.method === 'PUT' && id) {
    const { title, body } = await getBody(req);
    const note = db.update(id, title, body);
    if (!note) return sendJSON(res, 404, { success: false, error: 'Note not found' });
    return sendJSON(res, 200, { success: true, data: note });
  }

  // DELETE /api/notes/:id — delete
  if (req.method === 'DELETE' && id) {
    const deleted = db.remove(id);
    if (!deleted) return sendJSON(res, 404, { success: false, error: 'Note not found' });
    return sendJSON(res, 200, { success: true, message: 'Note deleted' });
  }

  // If nothing matched — method not allowed
  sendJSON(res, 405, { success: false, error: 'Method not allowed' });
};

module.exports = { handleNotes };