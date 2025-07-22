import http from 'node:http';
import fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { serveStatic } from './lib/static.js';

class LeelaJS {
  constructor() {
    this.routes = {};
    this.middlewares = [];
    this.server = http.createServer();
    this.server.on('request', (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      req.pathname = url.pathname;
      req.params = {
        get: (key) => url.searchParams.get(key),
        getAll: (key) => url.searchParams.getAll(key),
        has: (key) => url.searchParams.has(key)
      };
      res.sendFile = async (path, mimeType) => {
        const fileHandler = await fs.open(path, 'r');
        const fileStream = fileHandler.createReadStream();
        fileStream.pipe(res);
      };

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      //send JSOn data back to the client (for small json data less than highwatermark value)
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        const jsonString = JSON.stringify(data);
        const stream = Readable.from([jsonString]);
        stream.pipe(res);
      };

      this.runMiddlewares(req, res, () => {
        const routeKey = `${req.method.toLowerCase()}${req.pathname}`;
        const routeHandler = this.routes[routeKey];

        if (routeHandler) {
          routeHandler(req, res);
        } else {
          return res.status(404).json({
            error: `Cannot ${req.method} ${req.pathname}`
          });
        }
      });
    });
  }

  runMiddlewares(req, res, cb) {
    const totalMiddlewaresCount = this.middlewares.length;

    const run = (index) => {
      if (index < totalMiddlewaresCount) {
        this.middlewares[index](req, res, () => run(index + 1));
      } else {
        cb();
      }
    };
    run(0);
  }

  route(method, path, callback) {
    this.routes[`${method.toLowerCase()}${path}`] = callback;
  }

  beforeEach(cb) {
    this.middlewares.push(cb);
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }
}

LeelaJS.static = serveStatic;

export default LeelaJS;
