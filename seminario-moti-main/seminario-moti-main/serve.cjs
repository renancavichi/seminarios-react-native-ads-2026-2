const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
let port = Number(process.env.SEMINAR_PORT || 4173);
const firstPort = port;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.ttf': 'font/ttf', '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end('Arquivo não encontrado'); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(file).pipe(res);
});
server.on('listening', () => console.log(`Slides: http://localhost:${port}`));
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && port < firstPort + 10) { port += 1; server.listen(port, '127.0.0.1'); }
  else { console.error(`Não foi possível iniciar os slides: ${error.message}`); process.exitCode = 1; }
});
server.listen(port, '127.0.0.1');
process.on('SIGINT', () => server.close(() => process.exit(0)));
