# 一只游鱼 · 沉浸式水境博客

一个以「水」为隐喻的个人博客站点：全屏翻页 + Canvas 实时水境 + Web Audio 合成音效。
纯静态实现（HTML / CSS / 原生 JS），无框架、无构建步骤、无音频素材文件，克隆即可运行。

- 线上地址：https://yoyudev.github.io/YoyuDev-IPH/
- 源码仓库：https://github.com/YoyuDev/YoyuDev-IPH
- 作品集：https://yoyudev.github.io/
- CSDN 博客：https://blog.csdn.net/hahai_

---

## 页面结构

站点由 5 个全屏页面组成，通过翻页而非滚动浏览：

| 序号 | 页面 | 内容 |
| --- | --- | --- |
| 01 | 首页 | 头像、标语、累计数据、入口按钮 |
| 02 | 文章 | 站内 3 篇全文，其余引流至 CSDN |
| 03 | 作品 | 7 个项目的卡片，可跳转作品集详情 |
| 04 | 关于 | 个人简介与链接入口 |
| 05 | 留言 | 点赞按钮与留言板 |

翻页方式：鼠标滚轮、触摸滑动、键盘、右侧圆点导航，页面右下角显示页码 `01 / 05`。

## 交互与视觉特性

**Canvas 水境场景**（全屏背景层，实时绘制）

- 三层视差水波、持续上浮的气泡、游弋的鱼群、点击产生涟漪
- 首页绘制沙滩、椰子树与海鸥；翻页时水面下沉 / 上浮，完成「海面 → 水下」的场景过渡

**可点击的场景元素**

- 椰子：点击后从树上掉落，落地有音效
- 海鸥：点击后掉头并加速扇翅
- 游鱼：点击后停下吐泡泡

**留言板**

- 提交的留言会化作带昵称与内容的气泡，自屏幕底部（海底）摆动着上浮
- 到达顶部（海面）后「破裂」：迅速胀大、迸出小水珠并消散，同时播放破裂音效

**音效**

全部音效由 Web Audio API 在运行时合成，不含任何 mp3 / wav 素材。右上角按钮可随时开关。

| 函数 | 场景 |
| --- | --- |
| `blub` | 翻页水泡声 |
| `pop` | 点击按钮 |
| `ding` | 打开文章 |
| `gull` | 海鸥鸣叫 |
| `waterWhoosh` | 翻页入水的「扑通」声 |
| `bonk` | 椰子落地 |
| `bubbleBurst` | 留言气泡破裂 |

> 受浏览器策略限制，音效需在用户首次交互之后才会播放。

## 站内文章

站点收录 3 篇完整正文，其余 70 篇首发于 CSDN：

1. LangChain4j + 可观测性：第三方集成 Arize Phoenix（AI Agent · 2026.04.14）
2. Spark 3 与 Java 17 不兼容导致的 IllegalAccessError 解决方法（工程实践 · 2025.12.01）
3. IDEA 上传 Git 报错 git@ssh.github.com: Permission denied (publickey)（工程实践 · 2025.11.15）

## 目录结构

```
YoyuDev-IPH/
├── index.html          # 页面结构与全部内容容器
├── README.md
└── assets/
    ├── blog.css        # 设计变量、页面布局、气泡与破裂动画
    ├── blog.js         # 翻页、Canvas 水境、音效、文章与留言数据
    └── avatar.png      # 头像
```

## 本地预览

推荐用任意静态服务器打开（`file://` 直接双击在部分浏览器下会限制本地存储）：

```bash
# 任选其一
python -m http.server 8765
npx serve -l 8765
```

然后访问 http://127.0.0.1:8765/ 。

## 部署到 GitHub Pages

站点无构建步骤，直接用「分支部署」即可。

**1. 新建仓库**

在 https://github.com/new 创建名为 `YoyuDev-IPH` 的 **Public** 仓库，README 与 .gitignore 均**不要勾选**。

> ⚠️ 仓库名不要用 `yoyudev.github.io`。该名字是 GitHub Pages 的用户站点专用仓库，已被作品集占用，重名会覆盖作品集。本项目作为项目站点，会被部署到 `/YoyuDev-IPH/` 子路径下。

**2. 初始化并推送**

```bash
cd YoyuDev-IPH
git init -b main
echo ".idea/" > .gitignore          # 忽略 IDE 工程目录
git add .
git commit -m "feat: 一只游鱼沉浸式博客"
git remote add origin https://github.com/YoyuDev/YoyuDev-IPH.git
git push -u origin main
```

> 推送需要凭证：GitHub 已不支持密码认证，请使用 Personal Access Token，或先执行 `gh auth login`。

**3. 开启 Pages**

仓库页 **Settings → Pages** → Source 选 **Deploy from a branch** → Branch 选 `main`，目录选 `/ (root)` → **Save**。

**4. 等待生效**

约 1–2 分钟后，Pages 页顶部会出现 `Your site is live at https://yoyudev.github.io/YoyuDev-IPH/`。

**后续更新**

```bash
git add . && git commit -m "update" && git push
```

push 后 Pages 会自动重新部署，进度可在仓库的 **Actions** 页查看。

> `index.html` 中的样式、脚本与头像全部使用相对路径（`assets/...`），因此部署到 `/YoyuDev-IPH/` 子路径下不会出现资源 404。

## 可配置项

集中在 `assets/blog.js` 顶部，改一行即可：

| 常量 | 说明 |
| --- | --- |
| `REPO_URL` | 头部 GitHub 图标指向的仓库地址 |
| `MESSAGES_API` | 留言接口地址；留空表示仅使用浏览器本地存储 |
| `LIKE_SEED` | 点赞显示的基数 |
| `PORTFOLIO` | 作品集地址 |
| `CSDN` | CSDN 博客地址 |

页面文案、文章列表与项目列表分别位于 `index.html` 与 `assets/blog.js` 的 `POSTS` / `PROJECTS` 常量中。

## 已知边界

- 站点为纯静态，**没有后端**。留言与点赞保存在浏览器 `localStorage` 中，刷新后仍在，但**不同访客之间不互通**，也不是服务端统计。若需要跨访客可见，需接入后端接口（填写 `MESSAGES_API`）或改用 Giscus 等评论服务。
- 音效为运行时合成，且受浏览器自动播放策略限制，需用户先与页面交互。
- 站内文章与项目数据均来自作者真实发布的内容，未做虚构填充。
