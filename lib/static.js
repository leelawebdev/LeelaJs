import fs from 'node:fs/promises';
import path from 'node:path';

function getMimeType(filePath) {
  const MIME_TYPES = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    eot: 'application/vnd.ms-fontobject',
    otf: 'font/otf',
    ttf: 'font/ttf',
    woff: 'font/woff',
    woff2: 'font/woff2'
  };
  const ext = path.extname(filePath).slice(1);
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export function serveStatic(staticDir) {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const filePath = path.join(staticDir, req.pathname);

    try {
      await fs.access(filePath);
      const mimeType = getMimeType(filePath);
      res.setHeader('Content-Type', mimeType);

      await res.sendFile(filePath);
    } catch (e) {
      return next();
    }
  };
}
