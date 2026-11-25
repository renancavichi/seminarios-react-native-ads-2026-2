#!/usr/bin/env node
// Cria o projeto Expo (JavaScript), instala o Expo UI e copia o App.js da demo.
// Uso:  node setup.js          (cria e prepara)
//       node setup.js --start  (cria, prepara e já inicia o servidor)
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NOME = 'expo-ui-demo';
const raiz = __dirname;
const destino = path.join(raiz, NOME);

const major = Number(process.versions.node.split('.')[0]);
if (major < 18) {
  console.error('Node ' + process.versions.node + ' é antigo demais. Instale o Node LTS em https://nodejs.org');
  process.exit(1);
}

function run(cmd, cwd = raiz) {
  console.log('\n> ' + cmd);
  const r = spawnSync(cmd, { cwd, stdio: 'inherit', shell: true });
  if (r.status !== 0) {
    console.error('\nFalhou: ' + cmd);
    process.exit(r.status || 1);
  }
}

if (fs.existsSync(destino)) {
  console.log('A pasta ' + NOME + ' já existe. Vou reaproveitar.');
} else {
  run('npx --yes create-expo-app@latest ' + NOME + ' --template blank');
}

run('npx expo install @expo/ui', destino);
fs.copyFileSync(path.join(raiz, 'app', 'App.js'), path.join(destino, 'App.js'));
console.log('\nApp.js da demo copiado para ' + NOME + '/App.js');

if (process.argv.includes('--start')) {
  run('npx expo start', destino);
} else {
  console.log('\nPronto! Para rodar:\n  cd ' + NOME + '\n  npx expo start\n');
}
