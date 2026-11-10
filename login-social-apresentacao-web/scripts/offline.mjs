import { readdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(`${dir}/${e.name}`) : `${dir}/${e.name}`,
      ),
    )
  ).flat();
}
const files = (await walk("dist")).filter((f) => !f.endsWith("sw.js"));
const hash = createHash("sha256");
for (const file of files) hash.update(await readFile(file));
const cache = `login-social-${hash.digest("hex").slice(0, 12)}`;
await writeFile(
  "dist/sw.js",
  `const CACHE=${JSON.stringify(cache)}; const FILES=${JSON.stringify(files.map((f) => "/" + f.slice(5)))};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('login-social-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;const path=new URL(e.request.url).pathname;const known=FILES.includes(path);if(!known&&e.request.mode!=='navigate')return;e.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(known?path:'/index.html',{ignoreVary:true});return cached||fetch(e.request);}));});`,
);
console.log("Cache offline gerado: " + cache);
