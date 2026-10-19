/* ============================================================
   一只游鱼 · 沉浸式水境博客
   全屏翻页 + Canvas 水境（游鱼/气泡/水波/涟漪）+ Web Audio 音效
   数据均来自真实博客（CSDN · hahai_）与作品集（yoyudev.github.io）
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const PORTFOLIO = 'https://yoyudev.github.io/';
  const CSDN = 'https://blog.csdn.net/hahai_';
  const REPO_URL = 'https://github.com/YoyuDev/YoyuDev-IPH';   // 本站源码仓库（发布到 GitHub Pages 后指向此仓库）
  const MESSAGES_API = '';                                     // 留言后端接口地址；留空 = 仅浏览器本地存储

  /* ---------- 图标 ---------- */
  const I = {
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    piano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v8M11 4v8M15 4v8M19 4v8M3 12h18"/></svg>',
    soul: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 3.5 6 5.2 6 9a6 6 0 0 1-12 0c0-3.8 3-5.5 6-9z"/><path d="M12 21v-4"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    care: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l1.5-5h13L20 10M4 10v10h16V10M4 10h16M9 20v-6h6v6"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 2l4 5 4-5"/></svg>',
    csdn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/></svg>',
    sndOn: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    sndOff: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'
  };

  /* ---------- 文章数据（真实内容：3 篇站内全文，其余引流 CSDN） ---------- */
  const POSTS = [
    {
      id: 'langchain4j-arize-phoenix', tag: 'AI Agent', date: '2026.04.14', mins: 8,
      title: 'LangChain4j + 可观测性：第三方集成 Arize Phoenix',
      excerpt: '大模型应用「能跑」不难，难的是能查。用 OpenTelemetry + Arize Phoenix 把 Prompt、RAG 召回和 Token 消耗摊开看，才能定位幻觉出在哪一环。',
      sections: [
        { t: '为什么要做大模型应用的可观测性', body: [
          'Agent 应用最让人头疼的不是写不出 Prompt，而是<strong>出了问题不知道从哪儿查</strong>：模型突然开始胡说，到底是 Prompt 写得含糊，还是 RAG 压根没召回对文档？上下文是不是被截断了？Token 花在哪一步？没有可观测性，这些问题只能靠 log 里翻箱倒柜。',
          '我的判断是：大模型应用「能跑」不难，难的是<strong>能查</strong>。于是在 LangChain4j 项目里把链路追踪补齐，选型时选了 OpenTelemetry 做采集标准、Arize Phoenix 做展示端。'
        ]},
        { t: '为什么是 OpenTelemetry + Phoenix', body: [
          'OpenTelemetry 是目前事实上的追踪标准，而 Phoenix 原生支持 OTLP 协议接入，两者拼起来几乎是零成本组合：',
          '<ul><li><strong>协议中立</strong>：应用侧只管按 OTel 规范打 span，后端想从 Phoenix 换成 Langfuse、Jaeger 都不用改代码；</li><li><strong>语义约定现成</strong>：OTel 社区已有 GenAI 语义约定（gen_ai.* 属性），Prompt、completion、token 用量都有标准字段；</li><li><strong>Phoenix 免费</strong>：本地 Docker 起一个实例就能用，调试期不需要 SaaS 账号。</li></ul>'
        ]},
        { t: '接入过程', body: [
          'Phoenix 用 Docker 起在本地，默认暴露 OTLP gRPC 的 <code class="inline">4317</code> 端口。应用侧最省事的路径是挂 OTel Java Agent，不用改一行代码：',
          '<pre><span class="cm"># 启动 Phoenix</span>\ndocker run -p 6006:6006 -p 4317:4317 arizephoenix/phoenix\n\n<span class="cm"># Java 应用挂 OTel Agent，trace 自动导出到 Phoenix</span>\njava -javaagent:opentelemetry-javaagent.jar \\\n  -Dotel.service.name=langchain4j-app \\\n  -Dotel.exporter.otlp.endpoint=http://localhost:4317 \\\n  -jar app.jar</pre>',
          '挂上 Agent 后，LangChain4j 的 AiServices 调用、ChatModel 请求都会作为 span 被捕获。想要更细的粒度（比如把「知识检索」单独标成一个 span），再用代码方式创建 <code class="inline">Tracer</code> 手动补埋点即可。'
        ]},
        { t: '上线后重点盯三样东西', body: [
          '<ul><li><strong>Prompt 全文</strong>：展开 span 能看到发给模型的完整消息列表，系统提示词有没有被意外覆盖，一眼可见；</li><li><strong>RAG 召回</strong>：把检索到的文档片段作为 span 属性记录，幻觉排查就变成了「答案引用的段落是否存在」的对照题；</li><li><strong>Token 消耗</strong>：每次调用的 prompt/completion token 都有记录，哪个环节吃 token 一目了然。</li></ul>',
          '<blockquote>印象最深的一次排查：模型坚持输出英文，最后在 trace 里发现是知识库文档里混入的英文模板被召回了——这种问题只看最终答案，永远查不出来。</blockquote>'
        ]},
        { t: '几个踩过的坑', body: [
          '<ul><li><strong>span 属性数量有上限</strong>：大段文档直接塞属性会被截断，超长内容先做摘要再记录；</li><li><strong>导出节奏</strong>：BatchSpanProcessor 默认按批次导出，本地调试想实时看，改成 SimpleSpanProcessor；</li><li><strong>采样率</strong>：生产环境全量采样 token 成本扛不住，按 traceId 比例采样，保住排障下限。</li></ul>',
          '这套东西接完之后，最大的变化是心态上的：改 Prompt 不再是玄学调参，每一次失败都能摊开看。'
        ]}
      ],
      related: [
        { name: 'PianoAgent', desc: 'Multi-Agent 的 AI 音乐创作系统', href: PORTFOLIO + 'projects/piano-agent', icon: 'piano' },
        { name: 'SoulAgent', desc: 'LangChain4j 长期记忆型角色系统', href: PORTFOLIO + 'projects/soul-agent', icon: 'soul' },
        { name: 'dsh-ping', desc: 'Agent 提醒插件 · 开源 npm 包', href: PORTFOLIO + 'projects/dsh-ping', icon: 'bell' }
      ]
    },
    {
      id: 'spark3-java17-illegalaccesserror', tag: '工程实践', date: '2025.12.01', mins: 6,
      title: 'Spark 3 与 Java 17 不兼容导致的 IllegalAccessError 解决方法',
      excerpt: 'Java 17 的模块系统不再默认导出 sun.nio.ch，Spark 3 存算一体的老代码直接起不来。整理了一套 --add-opens 参数，附报错对照。',
      sections: [
        { t: '现象', body: [
          '把运行时从 Java 8 切到 Java 17 之后，Spark 3 的老作业在启动阶段直接炸掉，报错类似这样：',
          '<pre>java.lang.IllegalAccessError: class org.apache.spark.storage.StorageUtils$\n  cannot access class sun.nio.ch.DirectBuffer\n  (class org.apache.spark.storage.StorageUtils$ is in unnamed module of loader \'app\';\n   class sun.nio.ch.DirectBuffer is in module java.base of loader \'bootstrap\')</pre>',
          '进程起都起不来，跟依赖冲突那种运行中偶发的问题完全不是一个画风。'
        ]},
        { t: '原因：Java 17 的强封装', body: [
          '从 Java 9 开始 JRE 走模块化，到 <strong>Java 16 默认开启强封装（JEP 396），Java 17 彻底封死（JEP 403）</strong>：<code class="inline">sun.nio.ch</code> 这类内部 API 不再对未命名模块开放，反射和直接访问都会被拒绝。',
          '而 Spark 3 存算一体的老代码里大量使用了 <code class="inline">sun.nio.ch.DirectBuffer</code> 做堆外内存管理——在 Java 8 时代这不算事，到了 Java 17 就成了硬伤。'
        ]},
        { t: '解决：一组 --add-opens 参数', body: [
          '思路是给 JVM 显式「开闸」，把 Spark 用到的 java.base 内部包重新对未命名模块开放：',
          '<pre>--add-opens=java.base/java.lang=ALL-UNNAMED\n--add-opens=java.base/java.lang.invoke=ALL-UNNAMED\n--add-opens=java.base/java.lang.reflect=ALL-UNNAMED\n--add-opens=java.base/java.io=ALL-UNNAMED\n--add-opens=java.base/java.net=ALL-UNNAMED\n--add-opens=java.base/java.nio=ALL-UNNAMED\n--add-opens=java.base/java.util=ALL-UNNAMED\n--add-opens=java.base/java.util.concurrent=ALL-UNNAMED\n--add-opens=java.base/java.util.concurrent.atomic=ALL-UNNAMED\n--add-opens=java.base/sun.nio.ch=ALL-UNNAMED\n--add-opens=java.base/sun.nio.cs=ALL-UNNAMED\n--add-opens=java.base/sun.security.action=ALL-UNNAMED\n--add-opens=java.base/sun.util.calendar=ALL-UNNAMED</pre>',
          'spark-submit 场景下通过 <code class="inline">--driver-java-options</code> 和 <code class="inline">--conf spark.executor.extraJavaOptions</code> 分别下发给 driver 和 executor：',
          '<pre>spark-submit \\\n  --driver-java-options "$(cat add-opens.txt | tr \'\\n\' \' \')" \\\n  --conf spark.executor.extraJavaOptions=... \\\n  --class com.example.Job app.jar</pre>'
        ]},
        { t: '报错对照速查', body: [
          '<ul><li>报错里出现 <code class="inline">sun.nio.ch.DirectBuffer</code> → 补 <code class="inline">--add-opens=java.base/sun.nio.ch=ALL-UNNAMED</code>；</li><li><code class="inline">java.lang.invoke.MethodHandles$Lookup</code> 无法访问 → 补 <code class="inline">java.base/java.lang.invoke</code>；</li><li>反射调用 <code class="inline">java.util.Arrays</code> 的私有成员失败 → 补 <code class="inline">java.base/java.util</code>；</li><li>其他 <code class="inline">is in module java.base</code> 类报错 → 照抄报错里的包名，套 <code class="inline">--add-opens=java.base/&lt;包名&gt;=ALL-UNNAMED</code>。</li></ul>'
        ]},
        { t: '更彻底的思路', body: [
          'add-opens 是止血方案，治标。长期看两条路：<strong>升级 Spark</strong>（3.3+ 对 Java 17 的兼容性已经完善很多）或者<strong>把运行时固定在 Java 11</strong>，让 JDK 版本和 Spark 版本匹配。不推荐为了不兼容的老组件长期维护一长串 JVM 参数——每换一次环境都是重新踩一遍坑。'
        ]}
      ],
      related: [
        { name: 'Cy-fang 次元坊', desc: 'Spring Cloud 微服务架构实践', href: PORTFOLIO + 'projects/cy-fang', icon: 'tv' },
        { name: '对外贸易门户', desc: 'Spring Boot + Vue3 商用交付', href: PORTFOLIO + 'projects/foreign-trade-portal', icon: 'store' },
        { name: '全部作品', desc: '作品集 · 7 个上线与开源项目', href: PORTFOLIO + 'projects', icon: 'grid' }
      ]
    },
    {
      id: 'git-ssh-443-permission-denied', tag: '工程实践', date: '2025.11.15', mins: 5,
      title: 'IDEA 上传 Git 报错 git@ssh.github.com: Permission denied (publickey)',
      excerpt: '22 端口被墙后 Git 走 443，SSH 认不出默认密钥。通过 ~/.ssh/config 显式指定 Host 与 IdentityFile 解决。',
      sections: [
        { t: '现象', body: [
          'IDEA 里 push 代码，突然开始报：',
          '<pre>git@ssh.github.com: Permission denied (publickey).\nCould not read from remote repository.\nPlease make sure you have the correct access rights.</pre>',
          '密钥明明配过，本地 <code class="inline">id_ed25519</code> 好好的，GitHub 上也加过公钥——为什么突然就不认了？'
        ]},
        { t: '原因：22 端口走不通，Git 换了门', body: [
          '排查发现是网络环境里 <strong>22 端口被墙</strong>，SSH 连 <code class="inline">github.com:22</code> 根本握不上手。GitHub 官方给了备用通道：<strong>走 443 端口连 <code class="inline">ssh.github.com</code></strong>。',
          '问题就出在这儿：连接的主机名从 <code class="inline">github.com</code> 变成了 <code class="inline">ssh.github.com</code>，SSH 按主机名匹配配置，默认密钥的对应关系断了——「Permission denied (publickey)」其实是新通道上没找到该带的钥匙。'
        ]},
        { t: '解决：~/.ssh/config 显式指定', body: [
          '编辑 <code class="inline">~/.ssh/config</code>（Windows 在 <code class="inline">C:\\Users\\&lt;用户名&gt;\\.ssh\\config</code>），为 443 通道显式声明主机、端口和密钥：',
          '<pre>Host github.com\n    HostName ssh.github.com\n    Port 443\n    User git\n    IdentityFile ~/.ssh/id_ed25519\n    IdentitiesOnly yes</pre>',
          '这样配置之后，远程地址仍然写 <code class="inline">git@github.com:user/repo.git</code> 不用改，SSH 会自动把连接转到 <code class="inline">ssh.github.com:443</code>，并带上指定的密钥。'
        ]},
        { t: '验证', body: [
          '<pre>ssh -T git@github.com\n<span class="cm"># Hi YoyuDev! You\'ve successfully authenticated, but GitHub does not\n# provide shell access.</span></pre>',
          '看到这句就通了。回 IDEA 里 push，一次过。'
        ]},
        { t: '补充说明', body: [
          '<ul><li><strong>首次连接 443 通道</strong>会询问是否信任 <code class="inline">ssh.github.com</code> 的指纹，确认写入 known_hosts 即可；</li><li>多台机器多把密钥的场景，<code class="inline">IdentitiesOnly yes</code> 很关键，避免 SSH 拿默认密钥列表挨个试导致被拒；</li><li>公司内网同理：凡是被限制 22 端口的环境，都可以用这套 443 备用通道。</li></ul>'
        ]}
      ],
      related: [
        { name: 'dsh-ping', desc: '开源 npm 插件 · 工程化实践', href: PORTFOLIO + 'projects/dsh-ping', icon: 'bell' },
        { name: '全部作品', desc: '作品集 · 7 个上线与开源项目', href: PORTFOLIO + 'projects', icon: 'grid' }
      ]
    }
  ];

  /* ---------- 项目数据（来自真实作品集） ---------- */
  const PROJECTS = [
    { slug: 'piano-agent', name: 'PianoAgent', sub: 'Multi-Agent 的 AI 音乐创作系统', icon: 'piano', tags: ['Multi-Agent', 'RAG'], status: '开源 · npm' },
    { slug: 'soul-agent', name: 'SoulAgent', sub: '长期记忆型 AI 角色系统', icon: 'soul', tags: ['LangChain4j', '向量检索'], status: '开源' },
    { slug: 'dsh-ping', name: 'dsh-ping', sub: 'Agent 需要你时，主动叫一声', icon: 'bell', tags: ['TypeScript', 'SSE'], status: '开源 · npm' },
    { slug: 'beiqi-care', name: '陪护小程序', sub: '微信陪护服务预约平台', icon: 'care', tags: ['UniApp', 'Spring Boot'], status: '已上线' },
    { slug: 'foreign-trade-portal', name: '对外贸易门户', sub: '企业门户与后台管理系统', icon: 'store', tags: ['Vue3', 'MyBatis-Plus'], status: '已上线' },
    { slug: 'education-agent', name: '教育多智能体平台', sub: '5 类智能体协同资源生成', icon: 'cap', tags: ['RAG', 'Qdrant'], status: '软件杯' },
    { slug: 'cy-fang', name: '次元坊 Cy-fang', sub: '十个微服务拼起来的动漫站', icon: 'tv', tags: ['Spring Cloud', 'Nacos'], status: '个人项目' }
  ];

  const tagClass = t => t === 'AI Agent' ? '' : 'sun';
  let toastTimer = null;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  function copyEmail() {
    const email = '1910693646@qq.com';
    const done = () => toast('邮箱已复制 ✓');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done).catch(() => done());
    else { try { const ta = document.createElement('textarea'); ta.value = email; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done(); } catch (e) { toast(email); } }
  }

  /* ============================================================
     音效（Web Audio 合成，无外部资源）
     ============================================================ */
  let actx = null;
  let soundOn = store.get('yoyu-sound') !== '0';
  function ensureAudio() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (actx && actx.state === 'suspended') actx.resume();
  }
  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  }
  function blub() { // 翻页：水泡声
    if (!soundOn || !actx) return;
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain(), f = actx.createBiquadFilter();
    o.type = 'sine'; o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(660, t + .16);
    f.type = 'lowpass'; f.frequency.value = 1400;
    env(g, t, .03, .2, .3); o.connect(f); f.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .32);
  }
  function pop() { // 点击：短泡泡
    if (!soundOn || !actx) return;
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(920, t + .06);
    env(g, t, .012, .12, .09); o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .1);
  }
  function ding() { // 打开文章：双音
    if (!soundOn || !actx) return;
    [880, 1318.5].forEach((fr, i) => {
      const t = actx.currentTime + i * .07, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = fr;
      env(g, t, .02, .1, .5); o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .55);
    });
  }
  function gull() { // 海鸥鸣叫：两声「kyaa」，带颤音的下滑哨音
    if (!soundOn || !actx) return;
    [[0, 1], [.42, .82]].forEach(([d, vol]) => {
      const t = actx.currentTime + d;
      const dur = .48;
      // 双振荡器微失谐，模拟鸣管的粗糙感
      const g = actx.createGain(), bp = actx.createBiquadFilter(), lp = actx.createBiquadFilter();
      bp.type = 'bandpass'; bp.Q.value = 2.2;
      bp.frequency.setValueAtTime(2400, t);
      bp.frequency.exponentialRampToValueAtTime(1250, t + dur);
      lp.type = 'lowpass'; lp.frequency.value = 3800;
      [0, 9].forEach(det => {
        const o = actx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(1750 + det, t);
        o.frequency.exponentialRampToValueAtTime(950 + det, t + dur);
        o.connect(bp); o.start(t); o.stop(t + dur);
      });
      // 幅度颤音 → 沙哑的「嘎嘎」质感
      const tr = actx.createOscillator(), tg = actx.createGain();
      tr.frequency.value = 26; tg.gain.value = .5 * vol;
      const base = actx.createGain(); base.gain.value = .5 * vol;
      tr.connect(tg);
      bp.connect(lp); lp.connect(base); tg.connect(base.gain);
      const master = actx.createGain();
      env(master, t, .025, .05, dur);
      base.connect(master); master.connect(actx.destination);
      tr.start(t); tr.stop(t + dur);
    });
  }
  function waterWhoosh() { // 入水：扑通一声 + 上浮气泡
    if (!soundOn || !actx) return;
    const t = actx.currentTime;
    // ① 扑通：噪声快速低收
    const dur = .55;
    const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * .5;
    const src = actx.createBufferSource(); src.buffer = buf;
    const f = actx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(2400, t);
    f.frequency.exponentialRampToValueAtTime(160, t + dur);
    const g = actx.createGain();
    env(g, t, .008, .3, dur);
    src.connect(f); f.connect(g); g.connect(actx.destination);
    src.start(t); src.stop(t + dur);
    // ② 低频「咚」体鸣
    const o = actx.createOscillator(), og = actx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(55, t + .3);
    env(og, t, .01, .16, .34);
    o.connect(og); og.connect(actx.destination); o.start(t); o.stop(t + .36);
    // ③ 随后的三颗小气泡
    [.5, .72, .92].forEach((d, i) => {
      const bt = t + d, bo = actx.createOscillator(), bg = actx.createGain();
      bo.type = 'sine';
      bo.frequency.setValueAtTime(300 + i * 90, bt);
      bo.frequency.exponentialRampToValueAtTime(700 + i * 120, bt + .13);
      env(bg, bt, .02, .07, .17);
      bo.connect(bg); bg.connect(actx.destination); bo.start(bt); bo.stop(bt + .19);
    });
  }
  function bonk() { // 椰子落地：短促的低频「咚」
    if (!soundOn || !actx) return;
    const t = actx.currentTime;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(68, t + .13);
    env(g, t, .005, .2, .17);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .19);
  }
  function bubbleBurst() { // 留言气泡破裂：高频「啪」急速下滑 + 极短水膜噪声
    if (!soundOn || !actx) return;
    const t = actx.currentTime;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(1150, t);
    o.frequency.exponentialRampToValueAtTime(420, t + .08);
    env(g, t, .004, .18, .1);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .12);
    const dur = .06;
    const buf = actx.createBuffer(1, Math.max(1, Math.floor(actx.sampleRate * dur)), actx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = actx.createBufferSource(); src.buffer = buf;
    const hp = actx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
    const ng = actx.createGain(); env(ng, t, .003, .14, .07);
    src.connect(hp); hp.connect(ng); ng.connect(actx.destination); src.start(t); src.stop(t + dur);
  }
  const soundBtn = $('#soundBtn');
  function renderSound() {
    soundBtn.innerHTML = soundOn ? I.sndOn : I.sndOff;
    soundBtn.classList.toggle('off', !soundOn);
  }
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn; store.set('yoyu-sound', soundOn ? '1' : '0');
    ensureAudio(); renderSound(); if (soundOn) blub();
    toast(soundOn ? '音效已开启 🔊' : '音效已关闭 🔇');
  });
  renderSound();

  /* ============================================================
     水境画布：水波 · 气泡 · 游鱼 · 涟漪
     ============================================================ */
  const cv = $('#sea'), ctx = cv.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize(); window.addEventListener('resize', resize);

  const rand = (a, b) => a + Math.random() * (b - a);

  /* 气泡 */
  const bubbles = Array.from({ length: 22 }, () => ({
    x: rand(0, 1), y: rand(0, 1), r: rand(1.6, 5.5), v: rand(.22, .6), wob: rand(1, 3), ph: rand(0, 6.28)
  }));

  /* 游鱼 */
  const FISH_COLORS = [
    ['#0c9e8e', '#0a7a6e'], ['#5fd3b3', '#3bb694'], ['#ff7a6b', '#e85c4c'],
    ['#f5a623', '#d98a0f'], ['#3fb6e0', '#2b93bd'], ['#8b7cf6', '#6f5fe0']
  ];
  const fishes = FISH_COLORS.map((c, i) => ({
    x: rand(.05, .95), y: rand(.28, .82), s: rand(.7, 1.5),
    dir: Math.random() < .5 ? 1 : -1, speed: rand(.05, .14),
    wf: rand(1.6, 2.8), amp: rand(6, 18), ph: rand(0, 6.28),
    color: c[0], color2: c[1], lane: i % 3
  }));

  /* 涟漪 */
  const ripples = [];
  function ripple(x, y) {
    ripples.push({ x, y, r: 6, a: .5, v: rand(1.6, 2.2) });
    setTimeout(() => ripples.push({ x, y: y - 14, r: 6, a: .34, v: rand(1.4, 2) }), 160);
  }
  function dropRipple(x, y) { // 点击水滴：三圈同心涟漪
    ripples.push({ x, y, r: 4, a: .55, v: rand(1.8, 2.4) });
    setTimeout(() => ripples.push({ x, y, r: 4, a: .38, v: rand(1.5, 2) }), 130);
    setTimeout(() => ripples.push({ x, y, r: 4, a: .24, v: rand(1.3, 1.8) }), 270);
  }
  /* 点击页面任意处：激起水波纹；命中椰子/海鸥/鱼时触发互动 */
  window.addEventListener('pointerdown', e => {
    if (reduced) return;
    const cx = e.clientX, cy = e.clientY;
    dropRipple(cx, cy);
    if (typeof readerOpen !== 'undefined' && readerOpen) return;
    // 点椰子 → 掉下来
    if (surfaceAmt > .3) {
      const cp = crownPos();
      for (const c of coconuts) {
        if (c.st !== 0) continue;
        const x = cp.x + c.dx, y = cp.y + c.dy;
        if ((cx - x) ** 2 + (cy - y) ** 2 < (c.r * 2.4) ** 2) {
          c.st = 1; c.fx = x; c.fy = y; c.vy = 0;
          pop();
          return;
        }
      }
      // 点海鸥 → 掉头并加速扇翅
      for (const g of gulls) {
        const x = g.x * W, y = g.y * H - (1 - surfaceAmt) * H * .3;
        if ((cx - x) ** 2 + (cy - y) ** 2 < (36 * g.s) ** 2) {
          g.dir *= -1;
          g.flapMul = 1.9;
          setTimeout(() => { g.flapMul = 1; }, 800);
          gull();
          return;
        }
      }
    }
    // 点鱼 → 停下吐泡泡
    const lift = 1 - surfaceAmt;
    for (const f of fishes) {
      const bandY = .875 + (f.y - .28) / (.82 - .28) * .1;
      const x = f.x * W, y = (bandY * surfaceAmt + f.y * lift) * H;
      if ((cx - x) ** 2 + (cy - y) ** 2 < (30 * f.s) ** 2) {
        f.pauseT = performance.now() + 2600;
        blub();
        return;
      }
    }
  }, { passive: true });

  /* ---------- 海面场景（首页专属）：沙滩 · 椰树 · 海鸥 ---------- */
  let surfaceAmt = 1, surfaceTarget = 1;   // 1=首页海面，0=深水（翻页后场景下沉消失）

  const gulls = Array.from({ length: 3 }, () => ({
    x: rand(.08, .92), y: rand(.1, .26), dir: Math.random() < .5 ? 1 : -1,
    speed: rand(.06, .11), s: rand(.8, 1.25), ph: rand(0, 6.28), flap: rand(4.5, 7), flapMul: 1
  }));

  /* 岸线高度（沙滩与椰子共用地形） */
  const shoreAt = (x, off) => H * .845 + off + (x / W) * H * .1 + Math.sin(x * .006 + 1.2) * 8;

  /* 椰子：挂在树冠下，可被点落 */
  const coconuts = Array.from({ length: 5 }, (_, i) => ({
    dx: 13 + i * 6.6 + rand(-3, 3), dy: 8 + (i % 3) * 5.5,
    r: rand(3.8, 4.9), st: 0, fx: 0, fy: 0, vy: 0, restT: 0   // st: 0=树上 1=掉落 2=落地
  }));
  const crownPos = () => ({ x: W * .10 + 30, y: H * .862 + (1 - surfaceAmt) * H * .6 - H * .25 });

  function drawCoconut(x, y, r, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#6b4e2e';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,210,.35)';
    ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3d2c17';   // 椰子壳上的三个芽眼
    [-.38, .08, .5].forEach(k => {
      ctx.beginPath(); ctx.arc(x + k * r * .8, y + r * .12, r * .15, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  function drawSand(amt, t) {
    const off = (1 - amt) * H * .6;                // 翻页后整片沙滩向下沉出屏幕
    // 岸线：左侧高出水面的滩涂，向右下没入水中
    const shore = x => shoreAt(x, off);
    ctx.save();
    ctx.globalAlpha = amt;
    // 沙地主体
    ctx.fillStyle = '#f0dfb2';
    ctx.beginPath(); ctx.moveTo(0, shore(0));
    for (let x = 0; x <= W * .62; x += 14) ctx.lineTo(x, shore(x));
    ctx.lineTo(W * .62, H + off); ctx.lineTo(0, H + off); ctx.closePath(); ctx.fill();
    // 沙纹
    ctx.strokeStyle = 'rgba(180,140,70,.22)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      for (let x = 0; x <= W * .48; x += 18) {
        const y = shore(x) + 17 + k * 15 + Math.sin(x * .01 + k * 2.2) * 4;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // 沙粒点
    ctx.fillStyle = 'rgba(150,110,50,.3)';
    for (let i = 0; i < 22; i++) {
      const px = ((i * 97.3) % 1) * W * .44 + Math.sin(i * 7) * 14;
      const py = shore(px) + 12 + (i % 4) * 15;
      ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    // 小贝壳
    const sx = W * .15, sy = shore(W * .15) + 38;
    ctx.strokeStyle = 'rgba(160,105,60,.55)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(sx, sy, 6, Math.PI * .1, Math.PI * .95); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx - 5, sy + 2); ctx.lineTo(sx + 5, sy + 2); ctx.stroke();
    // 海星
    const stx = W * .32, sty = shore(W * .32) + 56;
    ctx.fillStyle = 'rgba(230,140,90,.65)';
    for (let k = 0; k < 5; k++) {
      const a = k * Math.PI * .4 - Math.PI / 2 + Math.sin(t * .3) * .03;
      ctx.beginPath();
      ctx.ellipse(stx + Math.cos(a) * 7, sty + Math.sin(a) * 7, 4.5, 2.2, a, 0, Math.PI * 2);
      ctx.fill();
    }
    // 岸线浪花白边（流动虚线）
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3.2;
    ctx.setLineDash([11, 15]); ctx.lineDashOffset = -t * 20;
    ctx.beginPath();
    for (let x = 0; x <= W * .62; x += 14) {
      const y = shore(x) + 4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawTree(amt, t) {
    const off = (1 - amt) * H * .6;                // 翻页后沉入水下
    const sway = Math.sin(t * .65) * .022;
    const bx = W * .10, by = H * .862 + off;       // 树根扎在沙滩上（水面之上）
    const th = H * .25;
    ctx.save();
    ctx.globalAlpha = amt;
    ctx.translate(bx, by); ctx.rotate(sway);
    // 树干（弯曲）
    ctx.strokeStyle = '#8a6a45'; ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -th * .55, 30, -th); ctx.stroke();
    ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.moveTo(9, -th * .5); ctx.quadraticCurveTo(20, -th * .75, 30, -th); ctx.stroke();
    // 叶冠（6 片羽状叶，随风摆动；椰子由主循环单独绘制，便于点落）
    ctx.translate(30, -th);
    for (let i = 0; i < 6; i++) {
      const ang = (-168 + i * 56) * Math.PI / 180 + sway * 2.4 + Math.sin(t * .95 + i * 1.3) * .05;
      ctx.save(); ctx.rotate(ang);
      ctx.fillStyle = i % 2 ? '#2e8b62' : '#3fa875';
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(th * .18, -th * .055, th * .36, th * .01);
      ctx.quadraticCurveTo(th * .17, th * .045, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawGull(g, amt, t) {
    const flyUp = (1 - amt) * H * .3;              // 翻页后海鸥向上飞离
    const flap = Math.sin(t * g.flap * (g.flapMul || 1) + g.ph);   // -1..1 翅膀扇动相位
    // 单侧翅膀（两段式：内翼 + 外翼尖羽）
    function wing(tipDrop, shade) {
      ctx.save();
      ctx.rotate(-.28 - flap * .5);
      ctx.fillStyle = shade ? 'rgba(214,226,228,.95)' : '#fdfefe';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-11, -6.5, -21, -4.5 - tipDrop);
      ctx.quadraticCurveTo(-30, -2 - tipDrop, -35, 3.5 - tipDrop);
      ctx.quadraticCurveTo(-19, 3.5, 0, 2.5);
      ctx.closePath(); ctx.fill();
      // 翼尖深色飞羽
      ctx.fillStyle = shade ? 'rgba(70,90,95,.4)' : 'rgba(70,90,95,.6)';
      ctx.beginPath();
      ctx.moveTo(-23, -3.8 - tipDrop);
      ctx.quadraticCurveTo(-31, -1.5 - tipDrop, -35, 3.5 - tipDrop);
      ctx.quadraticCurveTo(-28, 3.2 - tipDrop, -21, 1.2);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = amt;
    ctx.translate(g.x * W, g.y * H - flyUp + Math.sin(t * 1.2 + g.ph) * 7);
    ctx.scale(g.dir * g.s, g.s);
    // 远侧翅（暗，先画）
    ctx.save(); ctx.translate(0, 1.6); ctx.globalAlpha = amt * .6; wing(2.5, true); ctx.restore();
    // 尾羽
    ctx.fillStyle = '#eef4f2';
    ctx.beginPath();
    ctx.moveTo(-11, .5); ctx.lineTo(-20, 3.6); ctx.lineTo(-18.6, -.4); ctx.closePath(); ctx.fill();
    // 身体
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(0, 0, 12.5, 4.6, -.06, 0, Math.PI * 2); ctx.fill();
    // 灰背
    ctx.fillStyle = 'rgba(165,185,195,.55)';
    ctx.beginPath(); ctx.ellipse(-1, -1.7, 9.6, 2.3, -.06, 0, Math.PI * 2); ctx.fill();
    // 头
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(11.5, -2.8, 3.5, 0, Math.PI * 2); ctx.fill();
    // 喙
    ctx.fillStyle = '#f5a623';
    ctx.beginPath(); ctx.moveTo(14.4, -3.4); ctx.lineTo(19.4, -2.1); ctx.lineTo(14.4, -1.3); ctx.closePath(); ctx.fill();
    // 眼
    ctx.fillStyle = '#1d2b2a';
    ctx.beginPath(); ctx.arc(12.5, -3.4, .95, 0, Math.PI * 2); ctx.fill();
    // 近侧翅
    wing(0, false);
    ctx.restore();
  }


  function drawFish(f, t, yOverride) {
    const bob = Math.sin(t * f.wf + f.ph) * f.amp;
    ctx.save();
    ctx.translate(f.x * W, (yOverride !== undefined ? yOverride : f.y) * H + bob);
    ctx.scale(f.dir * f.s, f.s);
    ctx.globalAlpha = .88;
    const wag = Math.sin(t * f.wf * 1.7 + f.ph) * .55;
    // 尾巴
    ctx.fillStyle = f.color2;
    ctx.beginPath();
    ctx.moveTo(-13, 0);
    ctx.quadraticCurveTo(-23, -7 + wag * 6, -27, wag * 8 - 4);
    ctx.quadraticCurveTo(-21, 0, -27, wag * 8 + 4);
    ctx.quadraticCurveTo(-23, 7 + wag * 6, -13, 0);
    ctx.fill();
    // 背鳍
    ctx.beginPath();
    ctx.moveTo(-5, -7.5);
    ctx.quadraticCurveTo(1, -14, 8, -6.5);
    ctx.closePath(); ctx.fill();
    // 身体
    ctx.fillStyle = f.color;
    ctx.beginPath(); ctx.ellipse(0, 0, 15.5, 8.6, 0, 0, Math.PI * 2); ctx.fill();
    // 腹部高光
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.beginPath(); ctx.ellipse(2.5, 3.2, 10.5, 4, 0, 0, Math.PI * 2); ctx.fill();
    // 眼睛
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(9, -2.4, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0b3a34';
    ctx.beginPath(); ctx.arc(9.9, -2.4, 1.35, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawWave(baseYr, amp, color, t, speed, phase) {
    const baseY = H * baseYr;
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W + 8; x += 8) {
      const y = baseY + Math.sin(x * .006 + t * speed + phase) * amp + Math.sin(x * .013 - t * speed * .7) * amp * .45;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
  }

  let last = performance.now(), hidden = false;
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; if (!hidden) { last = performance.now(); requestAnimationFrame(loop); } });

  function loop(now) {
    if (hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    ctx.clearRect(0, 0, W, H);

    // 海面 ↔ 深水 过渡（首页=1，其余页=0）
    surfaceAmt += (surfaceTarget - surfaceAmt) * Math.min(1, dt * 2.4);
    if (Math.abs(surfaceTarget - surfaceAmt) < .002) surfaceAmt = surfaceTarget;
    const amt = surfaceAmt, lift = 1 - amt;

    // 沙滩（画在水波之下，翻页后下沉消失）
    if (amt > .01) drawSand(amt, t);

    // 水波三层（首页水线在底部一条窄带，翻页后上移 = 海底范围变广）
    drawWave(.84 - lift * .39, 16, 'rgba(12,158,142,.10)', t, .5, 0);
    drawWave(.895 - lift * .345, 20, 'rgba(12,158,142,.16)', t, .36, 2.1);
    drawWave(.95 - lift * .27, 24, 'rgba(10,122,110,.22)', t, .28, 4.2);

    // 气泡
    for (const b of bubbles) {
      b.y -= b.v * dt * .12;
      if (b.y < -.04) { b.y = 1.04; b.x = Math.random(); b.r = rand(1.6, 5.5); }
      const bx = b.x * W + Math.sin(t * b.wob + b.ph) * 7;
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(bx, b.y * H, b.r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.arc(bx - b.r * .3, b.y * H - b.r * .3, b.r * .28, 0, Math.PI * 2); ctx.fill();
    }

    // 游鱼（首页约束在底部水带内，深水后自由上浮；被点中会停下吐泡泡）
    for (const f of fishes) {
      const bandY = .875 + (f.y - .28) / (.82 - .28) * .1;   // 首页：映射进 .875–.975 水带
      const fy = bandY * amt + f.y * lift;
      const paused = now < (f.pauseT || 0);
      if (!paused) {
        f.x += f.dir * f.speed * dt * .1;
        if (f.x > 1.08) { f.x = 1.08; f.dir = -1; }
        if (f.x < -.08) { f.x = -.08; f.dir = 1; }
        if (Math.random() < .0015) f.dir *= -1;
      } else if (now > (f.bubT || 0)) {
        // 停下时从嘴边吐出一串小泡泡
        f.bubT = now + 240 + Math.random() * 260;
        bubbles.push({
          x: f.x + f.dir * .026 * f.s, y: fy - .012,
          r: rand(1.2, 3.4), v: rand(.5, .95), wob: rand(1, 3), ph: rand(0, 6.28)
        });
        if (bubbles.length > 48) bubbles.splice(0, bubbles.length - 48);
      }
      drawFish(f, t, fy);
    }

    // 椰树 + 海鸥 + 椰子（水面场景，翻页后下沉/飞离）
    if (amt > .01) {
      drawTree(amt, t);
      const off = (1 - amt) * H * .6;
      for (const c of coconuts) {
        if (c.st === 0) {                       // 挂在树上
          const cp = crownPos();
          drawCoconut(cp.x + c.dx, cp.y + c.dy, c.r, amt);
        } else {                                // 掉落/落地
          if (c.st === 1) {
            c.vy += 1500 * dt; c.fy += c.vy * dt;
            const ground = shoreAt(c.fx, off) - c.r;
            if (c.fy >= ground) {
              c.fy = ground; c.st = 2; c.restT = now + 6000;
              bonk(); ripple(c.fx, ground + 10);
            }
          } else if (now > c.restT) c.st = 0;   // 过几秒长回树上
          drawCoconut(c.fx, c.fy, c.r, amt);
        }
      }
      for (const g of gulls) {
        g.x += g.dir * g.speed * dt * .1;
        if (g.x > 1.1) { g.x = 1.1; g.dir = -1; }
        if (g.x < -.1) { g.x = -.1; g.dir = 1; }
        drawGull(g, amt, t);
      }
    }

    // 涟漪
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += r.v * dt * 120; r.a -= dt * .5;
      if (r.a <= 0) { ripples.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(12,158,142,${r.a.toFixed(3)})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
    }

    requestAnimationFrame(loop);
  }

  /* 场景状态调试钩子（便于自动化验证点击交互） */
  window.__scene = {
    coconuts, gulls, fishes,
    get surfaceAmt() { return surfaceAmt; },
    crownPos
  };

  if (reduced) {
    // 静态降级：只画一帧（首页海面全景）
    drawSand(1, 0);
    drawWave(.84, 16, 'rgba(12,158,142,.10)', 0, .5, 0);
    drawWave(.895, 20, 'rgba(12,158,142,.16)', 0, .36, 2.1);
    drawWave(.95, 24, 'rgba(10,122,110,.22)', 0, .28, 4.2);
    fishes.forEach(f => drawFish(f, 0, .875 + (f.y - .28) / (.82 - .28) * .1));
    drawTree(1, 0);
    gulls.forEach(g => drawGull(g, 1, 0));
  } else {
    requestAnimationFrame(loop);
  }

  /* ============================================================
     全屏翻页
     ============================================================ */
  const stage = $('#stage'), pages = $$('.page'), dotsBox = $('#dots'), pageNo = $('#pageNo');
  let cur = 0, lockedUntil = 0;
  let readerOpen = false;

  // 圆点
  pages.forEach((p, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<i>${p.dataset.title}</i>`;
    b.setAttribute('aria-label', p.dataset.title);
    b.addEventListener('click', () => { ensureAudio(); pop(); goTo(i); });
    dotsBox.appendChild(b);
  });
  const dots = $$('button', dotsBox);

  function runCounters() {
    $$('.stat strong').forEach(el => {
      const target = +el.dataset.count, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
      (function tick(now) {
        const p = Math.min(1, ((now || performance.now()) - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })();
    });
  }

  function goTo(i, silent) {
    i = Math.max(0, Math.min(pages.length - 1, i));
    const prev = cur;
    const changed = i !== cur;
    cur = i;
    surfaceTarget = (i === 0) ? 1 : 0;           // 首页浮出海面，其余页潜入深水
    stage.style.transform = `translateY(-${i * 100}vh)`;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    pageNo.textContent = `0${i + 1} / 0${pages.length}`;
    pages.forEach((p, k) => p.classList.toggle('active', k === i));
    if (i === 4) startBubbleSea(); else if (prev === 4) stopBubbleSea();   // 进入/离开留言页：放归 / 收回气泡
    if (changed && !silent) {
      if (!reduced) ripple(W * (i % 2 ? .72 : .28), H * rand(.3, .55));
      blub();
      if (i === 0) { runCounters(); gull(); }     // 回到海面：鸥鸣
      else if (prev === 0) waterWhoosh();          // 离开海面：入水声
    }
  }
  function step(d) {
    const now = Date.now();
    if (now < lockedUntil) return;
    const next = cur + d;
    if (next < 0 || next >= pages.length) return;
    lockedUntil = now + 950;
    ensureAudio();
    goTo(next);
  }

  // 滚轮
  let wheelAcc = 0;
  window.addEventListener('wheel', e => {
    if (readerOpen) return;
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) > 46) { step(wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
  }, { passive: true });
  // 触摸
  let touchY = null;
  window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (readerOpen || touchY === null) return;
    const d = touchY - e.changedTouches[0].clientY;
    if (Math.abs(d) > 48) step(d > 0 ? 1 : -1);
    touchY = null;
  }, { passive: true });
  // 键盘
  window.addEventListener('keydown', e => {
    if (readerOpen) { if (e.key === 'Escape') closeReader(); return; }
    ensureAudio();
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); step(1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); step(-1); }
    else if (e.key === 'Home') goTo(0);
    else if (e.key === 'End') goTo(pages.length - 1);
  });
  // 通用跳转按钮
  $$('[data-goto]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault(); ensureAudio(); pop(); goTo(+el.dataset.goto);
  }));
  // 点击音效
  $$('[data-sfx]').forEach(el => el.addEventListener('click', () => { ensureAudio(); pop(); }));

  /* ============================================================
     阅读层
     ============================================================ */
  const reader = $('#reader'), readerBody = $('#readerBody');
  function openReader(id) {
    const p = POSTS.find(x => x.id === id);
    if (!p) return;
    readerBody.innerHTML = `
      <span class="chip r-tag">${p.tag}</span>
      <h1>${p.title}</h1>
      <div class="r-meta">${p.date} · ${p.mins} min 阅读 · 首发于 <a href="${CSDN}" target="_blank" rel="noopener" style="color:var(--teal-deep)">CSDN</a></div>
      ${p.sections.map(s => `<h2>${s.t}</h2>${s.body.join('')}`).join('')}
      <div class="reader-related">
        <div class="rr-title">文中的技术 · 用在这些项目里 →</div>
        ${p.related.map(r => `
        <a class="rr-card" href="${r.href}" target="_blank" rel="noopener">
          <span class="rp-ic">${I[r.icon] || I.grid}</span>
          <span><strong>${r.name}</strong><small>${r.desc}</small></span>
          <span class="rp-arrow">${I.go}</span>
        </a>`).join('')}
      </div>`;
    readerBody.scrollTop = 0;
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reader-open');
    readerOpen = true;
    ensureAudio(); ding();
  }
  function closeReader() {
    reader.classList.remove('open');
    reader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reader-open');
    readerOpen = false;
  }
  $('#readerClose').addEventListener('click', closeReader);
  reader.addEventListener('click', e => { if (e.target === reader) closeReader(); });

  /* ============================================================
     头部 GitHub 仓库入口
     ============================================================ */
  $('#repoBtn').href = REPO_URL;

  /* ============================================================
     点赞（本地持久化）
     ============================================================ */
  const LIKE_SEED = 0;                    // 基础点赞数（纯真实计数，如日后接入后端可替换为服务端总量）
  const likeBtn = $('#likeBtn'), likeCount = $('#likeCount'), likeHint = $('#likeHint');
  let liked = store.get('yoyu-liked') === '1';
  function renderLike() {
    likeCount.textContent = LIKE_SEED + (liked ? 1 : 0);
    likeBtn.classList.toggle('on', liked);
    likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
    likeHint.textContent = liked ? '已点赞 · 谢谢 🐟' : '点个赞鼓励一下';
  }
  function burstHearts(x, y) {
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.className = 'like-burst';
      s.textContent = '♥';
      const ang = -Math.PI / 2 + rand(-.8, .8), dist = rand(38, 84);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.fontSize = rand(12, 22) + 'px';
      s.style.setProperty('--tx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--ty', Math.sin(ang) * dist + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }
  likeBtn.addEventListener('click', () => {
    liked = !liked; store.set('yoyu-liked', liked ? '1' : '0');
    renderLike(); ensureAudio(); pop();
    if (liked) {
      const r = likeBtn.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + 16);
      ding();
    }
    toast(liked ? '谢谢你的赞 ❤️' : '已取消点赞');
  });
  renderLike();

  /* ============================================================
     留言板 —— 留言化作气泡，自海底上浮至海面后消散（本地持久化）
     ============================================================ */
  const MSG_KEY = 'yoyu-messages';
  const msgForm = $('#msgForm'), msgText = $('#msgText'), msgName = $('#msgName'),
        msgCount = $('#msgCount'), bubbleZone = $('#bubbleZone');
  const bubbleTimers = [];             // 待上浮气泡的定时器

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function loadMessages() {
    try { const a = JSON.parse(store.get(MSG_KEY) || '[]'); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function saveMessages(list) { store.set(MSG_KEY, JSON.stringify(list.slice(0, 40))); }

  /* 把一条留言做成一枚气泡，从海底向海面漂浮，到顶即散 */
  function makeBubble(m) {
    const name = (m.name && m.name.trim()) || '匿名鱼';
    const b = document.createElement('div');
    b.className = 'float-bubble';
    b.style.setProperty('--x', rand(6, 58).toFixed(1) + '%');
    b.style.setProperty('--dur', rand(9, 15).toFixed(2) + 's');
    b.style.setProperty('--drift', Math.round(rand(18, 42)) + 'px');
    b.innerHTML = `
      <span class="fb-avatar">${escapeHtml(name.slice(0, 1))}</span>
      <div class="fb-main">
        <b>${escapeHtml(name)}</b>
        <p>${escapeHtml(m.text)}</p>
      </div>`;
    b.addEventListener('animationend', e => {
      if (e.animationName === 'bubbleUp') {        // 浮到海面：破裂
        bubbleBurst(); spawnDroplets(b);
        b.style.animationName = 'bubblePop';
        b.style.animationDuration = '.35s';
        b.style.animationTimingFunction = 'cubic-bezier(.2, .8, .3, 1)';
      } else {                                     // 破裂完毕：移除
        b.remove();
      }
    });
    bubbleZone.appendChild(b);
  }
  /* 破裂时迸出的小水珠（按气泡当前视觉位置生成） */
  function spawnDroplets(el) {
    const r = el.getBoundingClientRect(), zr = bubbleZone.getBoundingClientRect();
    const cx = r.left - zr.left + r.width / 2, cy = r.top - zr.top + r.height / 2;
    for (let i = 0; i < 7; i++) {
      const d = document.createElement('span');
      d.className = 'bubble-droplet';
      const ang = rand(0, Math.PI * 2), dist = rand(18, 46);
      d.style.left = cx + 'px';
      d.style.top = cy + 'px';
      d.style.setProperty('--dxx', Math.cos(ang) * dist + 'px');
      d.style.setProperty('--dyy', Math.sin(ang) * dist + 'px');
      bubbleZone.appendChild(d);
      d.addEventListener('animationend', () => d.remove());
    }
  }
  function startBubbleSea() {
    stopBubbleSea();
    const list = loadMessages();
    list.slice(0, 12).forEach((m, i) => bubbleTimers.push(setTimeout(() => makeBubble(m), i * 1100)));
  }
  function stopBubbleSea() {
    bubbleTimers.forEach(clearTimeout); bubbleTimers.length = 0;
    bubbleZone.innerHTML = '';
  }

  msgText.addEventListener('input', () => { msgCount.textContent = `${msgText.value.length} / 200`; });
  msgForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = msgText.value.trim();
    if (!text) { toast('还没有写内容哦'); msgText.focus(); return; }
    const msg = { name: msgName.value.trim().slice(0, 16), text: text.slice(0, 200), time: Date.now() };
    const list = loadMessages();
    list.unshift(msg);
    saveMessages(list);
    makeBubble(msg);                            // 立刻化作气泡上浮
    msgText.value = ''; msgCount.textContent = '0 / 200';
    ensureAudio(); ding();
    toast('留言已放归大海 🫧');
  });

  // 已有留言由 goTo() 在进入留言页时放归为气泡（见 startBubbleSea）

  /* ============================================================
     渲染各页内容
     ============================================================ */
  $('#postRow').innerHTML = POSTS.map(p => `
    <button class="post-card" data-read="${p.id}">
      <span class="pc-top"><span class="chip ${tagClass(p.tag)}">${p.tag}</span>
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--ink-faint)">${p.date}</span></span>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <span class="pc-meta"><span>${p.mins} min</span><b>阅读全文 →</b></span>
    </button>`).join('');
  $$('[data-read]').forEach(el => el.addEventListener('click', () => openReader(el.dataset.read)));

  $('#projGrid').innerHTML = PROJECTS.map(pj => `
    <a class="proj-card" href="${PORTFOLIO}projects/${pj.slug}" target="_blank" rel="noopener">
      <span class="pj-go">${I.up}</span>
      <span class="pj-ic">${I[pj.icon]}</span>
      <h4>${pj.name}</h4>
      <small>${pj.sub}</small>
      <span class="pj-tags">${pj.tags.map(t => `<i>${t}</i>`).join('')}<i style="background:rgba(255,122,107,.13);color:#d14c3c">${pj.status}</i></span>
    </a>`).join('');

  $('#linkRow').innerHTML = `
    <a class="link-card hero-link" href="${PORTFOLIO}" target="_blank" rel="noopener">
      <span class="lk-ic">${I.grid}</span>
      <h4>作品集</h4><p>7 个上线与开源项目的完整拆解</p>
      <span class="lk-url">yoyudev.github.io</span>
    </a>
    <a class="link-card" href="${CSDN}" target="_blank" rel="noopener">
      <span class="lk-ic">${I.csdn}</span>
      <h4>CSDN 博客</h4><p>全部 73 篇 · 100K+ 阅读</p>
      <span class="lk-url">blog.csdn.net/hahai_</span>
    </a>
    <a class="link-card" href="https://github.com/YoyuDev" target="_blank" rel="noopener">
      <span class="lk-ic">${I.github}</span>
      <h4>GitHub</h4><p>开源项目与代码</p>
      <span class="lk-url">github.com/YoyuDev</span>
    </a>
    <button class="link-card" id="mailCard">
      <span class="lk-ic">${I.mail}</span>
      <h4>邮箱联系</h4><p>求职 / 合作 / 交流</p>
      <span class="lk-url">1910693646@qq.com</span>
    </button>`;
  $('#mailCard').addEventListener('click', copyEmail);

  $('#year').textContent = new Date().getFullYear();

  // 初始：第一页激活 + 计数动画
  goTo(0, true);
  runCounters();
  // 首次用户手势时初始化音频（浏览器自动播放策略），并在首页播放一声鸥鸣
  let greeted = false;
  function greet() {
    ensureAudio();
    if (greeted) return;
    greeted = true;
    if (soundOn && cur === 0 && !readerOpen) gull();
  }
  window.addEventListener('pointerdown', greet, { once: true });
  window.addEventListener('keydown', greet, { once: true });
})();
