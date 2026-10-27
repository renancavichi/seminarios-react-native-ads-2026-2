const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const dist = path.join(__dirname, 'dist');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(dist, 'data.js'), 'utf8'), sandbox);
const data = sandbox.window.SEMINAR_DATA;
assert.equal(data.slides.length, 17, 'A sequência solicitada tem 17 slides');
assert.deepEqual(Array.from(data.slides.slice(0, 5), slide => slide.type), ['comparison','cover','stack','history','showcase']);
assert.deepEqual(Array.from(data.slides.slice(14), slide => slide.type), ['tradeoffs','alternatives','thanks']);
assert.equal(data.slides.reduce((sum, slide) => sum + slide.durationSeconds, 0), 1800, 'O roteiro deve durar 30 minutos');
const seen = new Set();
for (const slide of data.slides) {
  assert.ok(!seen.has(slide.id), `Slide repetido: ${slide.id}`);
  seen.add(slide.id);
  assert.ok(slide.notes && slide.title && slide.chapter);
  assert.ok(Number.isInteger(slide.durationSeconds) && slide.durationSeconds > 0);
  if (slide.activitySeconds) assert.ok(slide.activitySeconds <= slide.durationSeconds, `Atividade maior que o slide: ${slide.id}`);
  if (slide.answerIndex !== undefined) assert.ok(slide.options[slide.answerIndex]);
  for (const snippet of slide.snippets || []) assert.ok(data.snippets[snippet], `Trecho ausente: ${snippet}`);
}
for (const snippet of Object.values(data.snippets)) {
  const original = path.join(root, snippet.file);
  const file = fs.existsSync(original) ? original : path.join(__dirname, 'project-snapshot', snippet.file);
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const expected = text.split('\n').slice(snippet.start - 1, snippet.end).join('\n');
  assert.equal(snippet.raw, expected, `${snippet.id}: código divergente do arquivo original`);
  assert.equal(snippet.sha256, crypto.createHash('sha256').update(expected).digest('hex'));
  assert.equal(data.sources[snippet.file].text, text, `${snippet.file}: snapshot divergente`);
}
for (const file of ['index.html', 'slides.css', 'teaching.css', 'sequence.css', 'slides.js', 'rules.js', 'app.html', 'demo-bridge.js', 'seminar-lab/index.html']) assert.ok(fs.existsSync(path.join(dist, file)));
const appHtml = fs.readFileSync(path.join(dist, 'app.html'), 'utf8');
for (const match of appHtml.matchAll(/src="([^"?]+)"/g)) assert.ok(fs.existsSync(path.join(dist, match[1].replace(/^\//, ''))), `Asset da demo ausente: ${match[1]}`);
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.ok(!/https?:\/\/[^"']+\.(?:js|css)/.test(html), 'A apresentação deve funcionar sem CDN');
console.log(`${data.slides.length} slides e ${Object.keys(data.snippets).length} trechos conferidos contra o código original; demo e assets presentes.`);
