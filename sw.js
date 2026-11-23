/* Quaderno Rugby Test: salva l'app sul telefono così si apre anche senza rete.
   I dati (esercizi, schemi, calendario) non passano da qui: li gestiscono l'app e Firestore. */
const VERSION="qrt-1";
const SHELL=["./","index.html","firebase-config.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/favicon.svg"];
const FB="https://www.gstatic.com/firebasejs/10.14.1/";
const SDK=[FB+"firebase-app-compat.js",FB+"firebase-auth-compat.js",FB+"firebase-firestore-compat.js"];

self.addEventListener("install",e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(VERSION);
    await c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})));
    await Promise.allSettled(SDK.map(u=>c.add(new Request(u,{mode:"cors"}))));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate",e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k!==VERSION&&k.startsWith("qrt-")) await caches.delete(k);
    await self.clients.claim();
  })());
});

/* copia sul telefono subito, aggiornamento in sottofondo: la nuova versione arriva all'apertura successiva */
async function fresh(e,req,key){
  const c=await caches.open(VERSION);
  const hit=await c.match(key||req,{ignoreSearch:true});
  const net=fetch(req,{cache:"no-cache"}).then(r=>{ if(r&&r.ok) return c.put(key||req,r.clone()).then(()=>r); return r }).catch(()=>null);
  e.waitUntil(net.then(()=>{}));
  if(hit) return hit;
  const r=await net; if(r) return r;
  return new Response("Senza rete e senza copia sul telefono: apri l'app una volta con la connessione.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
}
/* file con versione nel nome (Firebase, caratteri): una volta salvati non cambiano */
async function kept(req){
  const c=await caches.open(VERSION);
  const hit=await c.match(req); if(hit) return hit;
  const r=await fetch(req); if(r&&(r.ok||r.type==="opaque")) c.put(req,r.clone()); return r;
}
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    if(req.mode==="navigate") return e.respondWith(fresh(e,req,new URL("index.html",self.registration.scope).href));
    if(/\.(html|js|css|webmanifest|png|svg|ico)$/.test(u.pathname)) return e.respondWith(fresh(e,req));
    return; // nient'altro: solo i file dell'app
  }
  if(u.hostname==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/")) return e.respondWith(kept(req));
  if(u.hostname==="fonts.gstatic.com") return e.respondWith(kept(req));
  if(u.hostname==="fonts.googleapis.com") return e.respondWith(fresh(e,req));
  /* tutto il resto (accesso, Firestore) va diretto in rete */
});
