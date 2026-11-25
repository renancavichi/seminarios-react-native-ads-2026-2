// Remove intent-filter e enableOnBackInvokedCallback do manifest da unityLibrary (UTF-8 sem BOM).
const fs = require('fs');
const path = require('path');
const m = path.join(__dirname, '..', 'unity', 'builds', 'android', 'unityLibrary', 'src', 'main', 'AndroidManifest.xml');
let t = fs.readFileSync(m, 'utf8').replace(/^﻿/, '');
t = t.replace(/<intent-filter>[\s\S]*?<\/intent-filter>/g, '');
t = t.replace(/\s+android:enableOnBackInvokedCallback="(true|false)"/g, '');
fs.writeFileSync(m, t);
console.log('manifest ok:', m);
