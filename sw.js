/* 泰语学习面板 Service Worker
   策略（PWA 桌面图标 + 离线可用）：
   - 页面导航（index.html）：网络优先，4 秒超时或断网回退缓存 → 在线永远是最新版，离线也能打开
   - 同源静态资源（art-audio.js / 图标 / manifest）：缓存优先，后台静默刷新（stale-while-revalidate）
   - 跨域请求（Google 字体 / TTS）：不代理，直接放行
   改动缓存结构时升级 CACHE 版本号，activate 会自动清掉旧缓存 */
const CACHE = "thai-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-1024.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== location.origin) return; // 跨域资源不走缓存代理

  if (req.mode === "navigate") {
    // 网络优先 + 超时/断网回退缓存
    e.respondWith((async () => {
      try {
        const net = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error("sw-nav-timeout")), 4000))
        ]);
        if (net && net.ok) {
          const c = await caches.open(CACHE);
          c.put("./index.html", net.clone());
        }
        return net;
      } catch (err) {
        const hit = await caches.match("./index.html") || await caches.match("./");
        if (hit) return hit;
        return new Response("离线且无缓存，请联网后重试", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
    return;
  }

  // 静态资源：缓存优先 + 后台刷新
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req);
    const refresh = fetch(req).then(r => {
      if (r && r.status === 200 && r.type === "basic") c.put(req, r.clone());
      return r;
    }).catch(() => hit);
    return hit || refresh;
  })());
});
