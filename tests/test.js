import LeelaJS from '../leelaJs.js';
import { serveStatic } from '../lib/static.js';

const server = new LeelaJS();

// Add static file serving middleware
server.beforeEach(LeelaJS.static('./public'));

// Add a regular route
server.route('get', '/api', (req, res) => {
  res.json({ message: 'API works!' });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Try: http://localhost:3000/index.html');
  console.log('Try: http://localhost:3000/style.css');
  console.log('Try: http://localhost:3000/api');
});
