/* TORPED offline cache. Bump VERSION when you change files to force a refresh. */
const VERSION='torped-v3';
const CORE=["./", "bacon-burger.webp", "basmatio-bowl.webp", "basmatio-hotdog.webp", "basmatio-ranch.webp", "beef-and-chicken.webp", "beef-mushroom.webp", "big-bunch-turkey.webp", "bucket-meal.webp", "cheese-burger.webp", "chicken-alfredo.webp", "chicken-cheese-lovers.webp", "chicken-lava.webp", "chicken-pane.webp", "chicken-zinger-mushroom.webp", "deep-chicken.webp", "double-beef-lovers.webp", "fajita.webp", "fries-cheese.webp", "fries-chili-jalapeno.webp", "fries-crumbles.webp", "fries-ranch.webp", "golden-crunch.webp", "grand-chicken.webp", "grilled-breast.webp", "grilled-shrimp.webp", "grilled-viagra.webp", "harika.webp", "hawawshi.webp", "hot-dog.webp", "index.html", "manifest.webmanifest", "install.js", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon-32.png", "italiano.webp", "king-slice.webp", "kofta-sandwich.webp", "photos.js", "royal-chicken-cheese.webp", "sawarekh.webp", "script.js", "sea-master.webp", "shanghai.webp", "shish-tawook.webp", "shrimp-pane.webp", "style.css", "superman-beef.webp", "superman-chicken.webp", "tasty-bite.webp", "tender-tray.webp", "torped-original.png", "tortilla-50cm.webp", "tray-meal.webp", "viagra-pane.webp", "wrap-fajita.webp", "wrap-italino.webp", "wrap-kofta-grilled.webp", "wrap-mix-chicken.webp", "wrap-mix-meat.webp", "wrap-pane.webp", "wrap-seafood.webp", "wrap-shanghai.webp", "wrap-shish-tawook.webp"];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(!/^https?:$/.test(url.protocol))return;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return r})
      .catch(()=>caches.match('index.html').then(r=>r||caches.match('./'))));
    return;
  }
  // everything else (own files + Google Fonts): cache first, refresh in background
  e.respondWith(caches.open(VERSION).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}).catch(()=>hit);
    return hit||net;
  })));
});
