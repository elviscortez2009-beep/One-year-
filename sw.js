const V='reina-v4',pad=n=>n<10?'0'+n:''+n;
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png','musica.mp3','video.mp4'];
for(let n=1;n<=127;n++)for(const e of ['.jpg','.png'])FILES.push('fotos/'+pad(n)+e);
async function rango(req,res){const b=await res.arrayBuffer(),m=/bytes=(\d+)-(\d*)/.exec(req.headers.get('range')),s=+m[1],e=m[2]?+m[2]:b.byteLength-1;
 return new Response(b.slice(s,e+1),{status:206,headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${s}-${e}/${b.byteLength}`,'Content-Length':e-s+1}})}
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(FILES.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url),html=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
 e.respondWith((async()=>{const c=await caches.open(V),rg=r.headers.get('range');
  if(!html){const hit=await c.match(r.url);if(hit)return rg?rango(r,hit):hit}
  try{const res=await fetch(r);if(res.status===200||res.type==='opaque')c.put(r.url,res.clone()).catch(()=>{});return res}
  catch(x){const hit=(await c.match(r.url))||(html&&await c.match('index.html'));if(hit)return rg?rango(r,hit):hit;return Response.error()}})())});
