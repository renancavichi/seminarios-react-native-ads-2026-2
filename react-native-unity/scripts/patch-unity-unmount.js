// Ao desmontar o <UnityView>, PAUSA a Unity em vez de descarregar.
// Motivo: a Unity 6 nao consegue criar um segundo player no mesmo processo
// ("UnityFoldingFeaturesWrapper.init() should be called only once"), entao reabrir a tela do jogo falhava.
// Com o player pausado, a biblioteca reaproveita a mesma instancia na proxima montagem.
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'node_modules', '@azesmway', 'react-native-unity');
const arquivos = ['src/UnityView.tsx', 'lib/commonjs/UnityView.js', 'lib/module/UnityView.js'];

for (const rel of arquivos) {
  const f = path.join(base, rel);
  let t = fs.readFileSync(f, 'utf8');
  if (t.includes('pauseUnity(this.ref.current, true); // patch')) {
    console.log('ja aplicado:', rel);
    continue;
  }
  const antes = t;
  t = t.replace(
    /(componentWillUnmount\(\)\s*\{[\s\S]*?if \(this\.ref\.current\) \{\s*)((?:_UnityViewNativeComponent\.)?Commands)\.unloadUnity\(this\.ref\.current\);/,
    '$1$2.pauseUnity(this.ref.current, true); // patch: pausa em vez de descarregar (Unity 6 nao reinicia)'
  );
  if (t === antes) throw new Error('padrao nao encontrado em ' + rel);
  fs.writeFileSync(f, t);
  console.log('ok:', rel);
}
