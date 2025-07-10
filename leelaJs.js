const http = require('node:http');
const fs = require('node:fs/promises');
const { Readable } = require('node:stream');

class LeelaJS {
  constructor() {
    /**
     *
     * [get/] = function
     * [get/dsds] = function
     */
    this.routes = {};
    this.middlewares = [];
    this.server = http.createServer();
    this.server.on('request', (req, res) => {
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
        const routeKey = `${req.method.toLowerCase()}${req.url}`;
        const routeHandler = this.routes[routeKey];

        if (routeHandler) {
          routeHandler(req, res);
        } else {
          return res.status(404).json({
            error: `Cannot ${req.method} ${req.url}`
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

module.exports = LeelaJS;
