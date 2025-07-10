const LeelaJS = require('../leelaJs.js');

const server = new LeelaJS();

// Test route with query parameters
server.route('get', '/search', (req, res) => {
  const query = req.params.get('q');
  const limit = req.params.get('limit') || '10';

  res.json({
    query: query,
    limit: limit,
    results: `Searching for "${query}" with limit ${limit}`
  });
});

server.listen(3000, () => {
  console.log('Test server running on port 3000');
  console.log('Try: http://localhost:3000/search?q=test&limit=5');
});
