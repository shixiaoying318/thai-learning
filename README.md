# เรียนไทย · 泰语学习面板

一个从零开始的泰语自学网页面板。**单文件、零依赖、零后端**——下载后用浏览器打开 `index.html` 就能学，不用安装、不用注册、不用服务器。

> 来自「云深不知处」个人学习小站的泰语模块，已剥离原站的账号与云同步部分，独立可运行。

## 快速开始

**方式一（最简单）**：下载或 clone 本仓库，双击 `index.html` 用浏览器打开，即可。

**方式二（完整体验，推荐）**：用任意本地静态服务器跑起来，可解锁「添加到桌面」「离线缓存」等 PWA 能力：

```bash
# 二选一
npx serve .
python -m http.server 8080
```

浏览器访问 `http://localhost:8080`（或 serve 显示的端口）。用 Chrome/Edge 打开时，地址栏右侧会出现「安装此站点为应用」，装完就像桌面 App 一样独立窗口运行。

**方式三（部署到服务器，分享给朋友）**：见下方「服务器部署说明」。

## 功能一览

| 模块 | 说明 |
|---|---|
| 🗺 学习路线 | 零基础到能读泰文的完整路线图，首页显示今日任务与总进度 |
| 🔤 字母表 | 44 辅音 + 元音 + 声调速查，点按即发音；详情弹窗带四线格手写练习（支持手指/触控笔） |
| 🃏 词库 | 主题词卡 + 手写拼写练习 |
| 🧩 组字练习 | 泰文拼字规则练习（辅音 + 元音 + 声调符号的组合堆叠） |
| 📖 文章学习 | 文章/歌曲逐段跟读播放，点词发音，可把生词收进词库 |
| ⏱ 自动学习计时 | 打开页面有操作就自动计时（类似 Apple Books），切后台自动暂停，无需手动打卡 |
| 🏅 学习记录 | 学习时长统计、打卡日历、成就徽章 |
| 💾 数据导出/导入 | 一键备份 JSON / 恢复，换电脑换浏览器可迁移 |

所有发音音频已预生成并内置在仓库里（`word-audio.js` / `art-audio.js`），**不依赖任何在线 TTS 服务**，离线也能全部播放。

## 学习路线文档（docs/）

仓库附带一份完整的自学路线与方法论文档，和页面「学习路线」标签页配套：

- `docs/README.md` —— 零基础到生肉的里程碑路线图、核心策略、防崩机制、资源清单、Anki 导入说明
- `docs/starter-deck.csv` —— 起始 150 词牌组（10 类别，分号分隔，可直接导入 Anki）
- `docs/notes/兴趣队列.md` —— 兴趣驱动模板：想啃的剧/歌/演出写进去，学不动时看一眼

## 数据存储说明

- 默认所有学习数据（进度、打卡、时长、徽章）都存在**浏览器 localStorage** 里，没有账号系统，数据不出本机
- 不同浏览器、不同电脑各自独立：Chrome 里的进度不会同步到 Edge
- ⚠️ 清理浏览器缓存/站点数据会清掉学习记录 → 建议定期点页面上的「导出数据」备份 JSON
- 换新设备：旧设备「导出数据」→ 新设备「导入数据」即可

## 服务器部署说明（可选）

纯静态站点，没有后端程序和数据库，任何静态托管都能跑：

| 平台 | 做法 | 备注 |
|---|---|---|
| GitHub Pages | 仓库 Settings → Pages → Source 选主分支 | 免费；国内访问可能不稳定 |
| 腾讯云 CloudBase 静态托管 | 控制台 → 云开发 → 静态网站托管 → 拖拽上传全部文件 | 有免费额度，自带默认访问域名 |
| Netlify / Vercel / Cloudflare Pages | 关联 GitHub 仓库自动部署，或直接拖拽上传 | 免费，海外节点速度快 |

自定义域名提示：使用中国内地托管 + 自定义域名需要 ICP 备案；不想备案就选 GitHub Pages / Netlify / Vercel / Cloudflare，或直接用平台默认域名。

## 进阶：接入自己的云同步（可选）

原版支持跨设备云同步（腾讯云 CloudBase），本仓库已剥离。页面代码保留了 `window.Site` 适配接口——在 `index.html` 的 `<head>` 里加一个自己的 js，实现下面 4 个方法，即可对接任意后端：

```js
window.Site = {
  init: async () => true,                        // 云服务是否可用（返回 false 则保持本地模式）
  currentUser: async () => ({ nickname: "我" }), // 当前登录用户；返回 null 则本地模式
  loadCloudState: async (key) => null,           // 读云端存档：{ data, updatedAt } 或 null
  saveCloudState: async (key, payload) => true,  // 上传存档（payload 为 JSON 对象）
};
```

不提供 `window.Site` 时页面自动运行在本地模式（右上角徽章显示「本地模式」），即本仓库的默认状态，功能不受任何影响。

用腾讯云 CloudBase 的话：创建环境 → 开通数据库与静态托管 → 用 `@cloudbase/js-sdk` 实现上述 4 个方法即可。

## 浏览器兼容

- 推荐最新版 Chrome / Edge / Safari / Firefox，手机浏览器同样可用
- 泰文字符显示：Windows 自带 Leelawadee UI、macOS/iOS 自带 Thonburi、Android 自带 Noto Sans Thai，均可正常显示
- 联网时会加载 Google Fonts（Sarabun / Prompt 等界面字体）；加载不了时自动回退系统字体，不影响使用。手写风格的 Mali 字体已内嵌页面，离线可用
- 手写练习支持鼠标、手指、触控笔（iPad / 手写屏）

## 文件结构

```
├── index.html           # 页面主体（UI + 内容数据 + 逻辑都在这一个文件里，约 8MB）
├── word-audio.js        # 词汇/组字发音音频包（base64，懒加载）
├── art-audio.js         # 文章发音音频包（base64，懒加载）
├── sw.js                # Service Worker（PWA 离线缓存；file:// 打开时自动静默停用）
├── manifest.webmanifest # PWA 清单（桌面图标/名称）
├── icons/icon-1024.png  # 应用图标
└── docs/                # 学习路线文档（脱敏版）：README.md / starter-deck.csv / notes/兴趣队列.md
```

## 许可

MIT —— 可自由使用、修改、分发。
