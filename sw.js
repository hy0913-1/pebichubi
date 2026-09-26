const VERSION='pebichubi-v9-5';
const CORE_CACHE=VERSION+'-core';
const RUNTIME_CACHE=VERSION+'-runtime';
const CORE=[
  './', './index.html', './manifest.webmanifest',
  './icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png'
];
const EXTERNAL=[
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const core=await caches.open(CORE_CACHE);
    for(const url of CORE){ try{ await core.add(url); }catch(e){} }
    const runtime=await caches.open(RUNTIME_CACHE);
    for(const url of EXTERNAL){
      try{
        const req=new Request(url,{mode:'no-cors',cache:'reload'});
        const res=await fetch(req);
        await runtime.put(req,res);
      }catch(e){}
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keep=new Set([CORE_CACHE,RUNTIME_CACHE]);
    for(const key of await caches.keys()) if(!keep.has(key)) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(req);
        const c=await caches.open(CORE_CACHE); c.put('./index.html',fresh.clone()).catch(()=>{});
        return fresh;
      }catch(e){
        return (await caches.match(req)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const hit=await caches.match(req);
    if(hit) return hit;
    try{
      const fresh=await fetch(req);
      if(fresh && (fresh.ok || fresh.type==='opaque')){
        const c=await caches.open(RUNTIME_CACHE); c.put(req,fresh.clone()).catch(()=>{});
      }
      return fresh;
    }catch(e){
      return hit || Response.error();
    }
  })());
});
