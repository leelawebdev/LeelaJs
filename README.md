# leelajs 🚀

A lightweight, simple HTTP server framework for Node.js - built for simplicity and ease of use.

## ✨ Features

- 🔧 Simple routing system
- 🔗 Middleware support
- 📡 JSON response handling
- 📁 File serving with sendFile method
- 🎯 Minimal and fast
- 🛠️ Built on Node.js native HTTP module

## 📦 Installation

```bash
npm install leelajs
```

## 🚀 Quick Start

```javascript
const LeelaJS = require('leelajs');

const server = new LeelaJS();

// Define a simple route
server.route('get', '/', (req, res) => {
  res.json({ message: 'Hello from LeelaJS!' });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 📚 API Documentation

### Creating a Server

```javascript
const LeelaJS = require('leelajs');
const server = new LeelaJS();
```

### Routing

Define routes using the `route()` method:

```javascript
server.route(method, path, handler);
```

**Parameters:**

- `method` (string): HTTP method ('get', 'post', 'put', 'delete', etc.)
- `path` (string): Route path
- `handler` (function): Route handler function `(req, res) => {}`

**Examples:**

```javascript
// GET route
server.route('get', '/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// POST route
server.route('post', '/users', (req, res) => {
  res.status(201).json({ id: 1, name: 'John' });
});

// Dynamic routes
server.route('get', '/users/profile', (req, res) => {
  res.json({ user: 'profile data' });
});
```

### Middleware

Add middleware functions that run before route handlers using the `beforeEach()` method:

```javascript
server.beforeEach((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Call next to continue to the next middleware or route handler
});
```

**Examples:**

```javascript
// Logging middleware
server.beforeEach((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware
server.beforeEach((req, res, next) => {
  const token = req.headers.authorization;
  if (!token && req.url !== '/login') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### Response Methods

LeelaJS extends the native Node.js response object with additional methods:

#### `res.status(code)`

Set the HTTP status code:

```javascript
server.route('get', '/not-found', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});
```

#### `res.json(data)`

Send JSON response:

```javascript
server.route('get', '/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});
```

#### `res.sendFile(path, mimeType)`

Send a file as response:

```javascript
server.route('get', '/download', async (req, res) => {
  await res.sendFile('./files/document.pdf');
});
```

### Server Methods

#### `server.listen(port, callback)`

Start the server on the specified port:

```javascript
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Parameters:**

- `port` (number): Port number to listen on
- `callback` (function): Optional callback function called when server starts

## 🔥 Complete Example

```javascript
const LeelaJS = require('leelajs');

const server = new LeelaJS();

// Add logging middleware
server.beforeEach((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
server.route('get', '/', (req, res) => {
  res.json({ message: 'Welcome to LeelaJS!' });
});

server.route('get', '/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

server.route('post', '/users', (req, res) => {
  res.status(201).json({ message: 'User created', id: Date.now() });
});

server.route('get', '/file', async (req, res) => {
  await res.sendFile('./public/index.html');
});

// Start server
server.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you find any bugs or have feature requests, please open an issue on [GitHub](https://github.com/leelawebdev/leelajs/issues).

## 📖 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 👨‍💻 Author

**Leela Web Dev**

---

⭐ Star this project if you find it helpful!
