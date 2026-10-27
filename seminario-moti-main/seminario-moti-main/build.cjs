const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const site = __dirname;
const originalRoot = path.resolve(site, '..');
const root = fs.existsSync(path.join(originalRoot, 'src/game/rules.js')) ? originalRoot : path.join(site, 'project-snapshot');
const dist = path.join(site, 'dist');
const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');
fs.mkdirSync(dist, { recursive: true });

const snippets = {};
const sources = {};
function excerpt(id, file, startText, endText, endOffset = 0) {
  const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.includes(startText));
  const end = lines.findIndex((line, index) => index >= start && line.includes(endText)) + endOffset;
  if (start < 0 || end < start || end >= lines.length) throw new Error(`Trecho não encontrado: ${id}`);
  const raw = lines.slice(start, end + 1).join('\n');
  sources[file] = { file, text, sha256: sha(text) };
  snippets[id] = { id, file, start: start + 1, end: end + 1, raw, sha256: sha(raw) };
}
excerpt('dependencies', 'package.json', '"moti":', '"react-native-worklets":');
excerpt('rules', 'src/game/rules.js', 'function getOutcome(', "return player.beats", 1);
excerpt('basic', 'components/ChoiceDisplay.js', '<Pressable accessibilityRole=', '</Pressable>');
excerpt('aura', 'components/game/BattleCinema.js', '<MotiView key={`aura-', 'style={[styles.aura');
excerpt('travel', 'components/game/DuelBoard.js', '<MotiView key={choice.id}', 'transition={{ type:', 0);
excerpt('measurement', 'components/game/DuelBoard.js', 'const measure = useCallback(', 'const old = previous[key];', 3);
excerpt('transforms', 'components/game/MotiCard.js', 'const transforms = ', '];');
excerpt('flip', 'components/game/MotiCard.js', "from={{ transform: [{ perspective: 900 }, { rotateY:", 'style={[styles.face, { borderColor: color }]}');
excerpt('phases', 'src/game/useDuel.js', "setPhase('summon');", '    ];');
excerpt('camera', 'components/game/DuelBoard.js', 'const heroWidth = ', 'const frame = ');
excerpt('summon', 'components/game/DuelBoard.js', "if (duel.phase === 'summon')", "} else if (duel.phase === 'reveal')", -1);
excerpt('orbit', 'components/game/BattleCinema.js', '<MotiView key={`orbit-', 'borderRadius: diameter,');
excerpt('particles', 'components/game/DuelEffects.js', 'Array.from({ length: 24 }', 'style={[styles.spark');
excerpt('sequence', 'components/game/MotiCard.js', 'animate={{ opacity: dim', "transition={{ type: 'timing'");
excerpt('presence', 'components/game/DuelBoard.js', '      <AnimatePresence>', '      </AnimatePresence>');
excerpt('sceneExit', 'components/game/BattleCinema.js', '<MotiView pointerEvents=', 'transition={{ type:');
excerpt('arrival', 'components/game/DuelBoard.js', 'onDidAnimate={(property, finished', 'onArrive(travel.token);');
excerpt('reduced', 'src/game/GameSettings.js', '<SettingsContext.Provider', '      {children}', -1);
excerpt('instant', 'src/game/useDuel.js', 'if (!animated || motionReduced)', "setPhase('summon');", -1);
excerpt('labImports', 'src/seminar/MotiLab.js', "import { AnimatePresence, MotiText, MotiView }", "import { AnimatePresence, MotiText, MotiView }");
excerpt('labMount', 'src/seminar/MotiLab.js', '<MotiView key={replay}', '      </MotiView>');
excerpt('labState', 'src/seminar/MotiLab.js', '<MotiView testID="lab-state-box"', '      </MotiView>');
excerpt('labTiming', 'src/seminar/MotiLab.js', '<View style={styles.track}>', 'styles.springDot]} />', 1);
excerpt('labPresence', 'src/seminar/MotiLab.js', '      <AnimatePresence>', '      </AnimatePresence>');
excerpt('rays', 'components/game/BattleCinema.js', 'Array.from({ length: 14 }', 'style={[styles.ray');
excerpt('motiText', 'components/game/BattleCinema.js', '<MotiText key={`title-', '</MotiText>');
excerpt('bootstrap', 'src/app/_layout.js', "import 'react-native-reanimated';", "import 'react-native-reanimated';");

// A interação das regras executa a função original, sem uma versão reescrita.
const rulesText = fs.readFileSync(path.join(root, 'src/game/rules.js'), 'utf8');
fs.writeFileSync(path.join(dist, 'rules.js'), `window.PROJECT_RULES = (() => { const module = { exports: {} };\n${rulesText}\nreturn module.exports; })();\n`);
const slides = require('./content.cjs');
const presenter = require('./presenter.cjs');
const formatTime = value => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
let elapsed = 0;
const script = '# Moti — roteiro do seminário de 30 minutos\n\n' +
  'Use as falas como apoio, adaptando ao seu jeito de explicar. Os 30 minutos incluem as demonstrações e pausas; o texto não precisa ser lido integralmente.\n\n' +
  'Antes de começar: execute npm run seminario, teste os quatro laboratórios e o jogo, mantenha as notas fechadas na projeção e use as setas para navegar.\n\n' +
  slides.map((slide, index) => {
    const start = elapsed;
    elapsed += slide.durationSeconds;
    const talk = presenter[slide.id];
    if (!talk?.speech?.length) throw new Error(`Fala do apresentador ausente: ${slide.id}`);
    return `## ${index + 1}. ${slide.title}${slide.accent ? ` ${slide.accent}` : ''}\n\n` +
      `**${formatTime(start)}–${formatTime(elapsed)}** · ${slide.chapter}\n\n` +
      `### Fala sugerida\n\n${talk.speech.join('\n\n')}\n\n` +
      `### O que mostrar\n\n${talk.demonstration}\n\n` +
      (slide.snippets?.length ? `**Trechos disponíveis:** ${slide.snippets.map(id => `${snippets[id].file}:${snippets[id].start}–${snippets[id].end}`).join('; ')}.\n\n` : '') +
      (talk.transition ? `**Transição para o próximo slide:** ${talk.transition}\n\n` : '');
  }).join('');
fs.writeFileSync(path.join(site, 'roteiro.md'), script);
fs.writeFileSync(path.join(dist, 'roteiro.md'), script);
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const data = { title: 'Moti — Seminário de 30 minutos', slides, snippets, sources, dependencies: packageJson.dependencies,
  references: [
    { title: 'Moti: animações', url: 'https://moti.fyi/animations' },
    { title: 'Moti: origem e motivação pelo autor', url: 'https://moti.fyi/' },
    { title: 'Proposta original: Dripsy RFC #46 (2020)', url: 'https://github.com/nandorojo/dripsy/issues/46' },
    { title: 'Moti: instalação', url: 'https://moti.fyi/installation' },
    { title: 'Moti: propriedades', url: 'https://moti.fyi/api/props' },
    { title: 'Moti: transformações', url: 'https://moti.fyi/api/transforms' },
    { title: 'Moti e Reanimated', url: 'https://moti.fyi/reanimated' },
    { title: 'Expo SDK 54: Reanimated', url: 'https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/' },
    { title: 'Reanimated: primeira animação', url: 'https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation/' },
    { title: 'Animated: React Native', url: 'https://reactnative.dev/docs/animated' },
    { title: 'Lottie React Native: repositório oficial', url: 'https://github.com/lottie-react-native/lottie-react-native' },
  ] };
for (const slide of slides) {
  const talk = presenter[slide.id];
  slide.notes = `${talk.speech.join('\n\n')}\n\nO que mostrar: ${talk.demonstration}${talk.transition ? `\n\nTransição: ${talk.transition}` : ''}`;
}
for (const [file, snapshot] of Object.entries(sources)) {
  const target = path.join(site, 'project-snapshot', file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, snapshot.text);
}
fs.mkdirSync(path.join(site, 'project-snapshot'), { recursive: true });
if (path.join(root, 'package.json') !== path.join(site, 'project-snapshot/package.json')) {
  fs.copyFileSync(path.join(root, 'package.json'), path.join(site, 'project-snapshot/package.json'));
}
fs.writeFileSync(path.join(dist, 'data.js'), `window.SEMINAR_DATA = ${JSON.stringify(data).replaceAll('<', '\\u003c')};\n`);
fs.writeFileSync(path.join(dist, 'provenance.json'), JSON.stringify({ snippets, sources }, null, 2));
for (const file of ['index.html', 'slides.css', 'teaching.css', 'sequence.css', 'slides.js', 'demo-bridge.js']) fs.copyFileSync(path.join(site, file), path.join(dist, file));
const imageDir = path.join(dist, 'images');
fs.mkdirSync(imageDir, { recursive: true });
for (const [name, original] of Object.entries({ basic: 'basic-mobile', idle: 'moti-mobile', invocation: 'epic-invocation', reveal: 'epic-reveal', clash: 'epic-clash', victory: 'epic-victory' })) {
  const originalFile = path.join(originalRoot, '.expo', `${original}.png`);
  const file = fs.existsSync(originalFile) ? originalFile : path.join(site, 'reference-images', `${name}.png`);
  if (!fs.existsSync(file)) throw new Error(`Captura real ausente: ${file}`);
  fs.copyFileSync(file, path.join(imageDir, `${name}.png`));
  fs.mkdirSync(path.join(site, 'reference-images'), { recursive: true });
  if (file !== path.join(site, 'reference-images', `${name}.png`)) fs.copyFileSync(file, path.join(site, 'reference-images', `${name}.png`));
}
const gameDir = path.join(site, 'game-export');
if (fs.existsSync(path.join(site, '.game-build/index.html'))) fs.cpSync(path.join(site, '.game-build'), gameDir, { recursive: true });
for (const name of ['_expo', 'assets']) {
  const from = path.join(gameDir, name);
  if (fs.existsSync(from)) fs.cpSync(from, path.join(dist, name), { recursive: true });
}
if (fs.existsSync(path.join(gameDir, 'favicon.ico'))) fs.copyFileSync(path.join(gameDir, 'favicon.ico'), path.join(dist, 'favicon.ico'));
const gameHtml = fs.readFileSync(path.join(gameDir, 'index.html'), 'utf8').replace('<head>', '<head>\n<script src="/demo-bridge.js"></script>');
fs.writeFileSync(path.join(dist, 'app.html'), gameHtml);
for (const route of ['game', 'moti', 'home', 'seminar-lab']) {
  fs.mkdirSync(path.join(dist, route), { recursive: true });
  fs.writeFileSync(path.join(dist, route, 'index.html'), gameHtml);
}
const manifestPath = path.join(site, '.openai/hosting.json');
if (fs.existsSync(manifestPath)) {
  const hosting = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  hosting.static = { directory: 'dist' };
  fs.writeFileSync(manifestPath, JSON.stringify(hosting, null, 2) + '\n');
}
console.log(`${slides.length} slides, ${Object.keys(snippets).length} trechos extraídos e app real empacotado.`);
