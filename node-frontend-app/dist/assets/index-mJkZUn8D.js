(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))d(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const m of l.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&d(m)}).observe(document,{childList:!0,subtree:!0});function s(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function d(i){if(i.ep)return;i.ep=!0;const l=s(i);fetch(i.href,l)}})();const C=document.getElementById("app"),T="huiniao_ai_app_demo_v1",L={tab:"home",currentTool:"电商主图",draftTheme:"电商主图",searchKeyword:"",vipOpened:!1,templateGroupIndex:0,templateSort:"hot",favoritedTemplateIds:{},messages:[{id:"m1",text:"你的“护肤品主图套版”已生成完成",read:!1},{id:"m2",text:"系统已为你推荐更匹配的模板",read:!1},{id:"m3",text:"会员限时活动：首月 6 折",read:!0}],generation:{status:"idle",last:null},profile:{name:"演示用户"}},u=[{id:"tool_hero",label:"主图生成",icon:"图",toolName:"电商主图",vipOnly:!1},{id:"tool_fitting",label:"模特换装",icon:"模",toolName:"模特换装",vipOnly:!1},{id:"tool_bg",label:"背景替换",icon:"背",toolName:"背景替换",vipOnly:!0},{id:"tool_expand",label:"智能扩图",icon:"扩",toolName:"智能扩图",vipOnly:!0},{id:"tool_cutout",label:"一键抠图",icon:"抠",toolName:"一键抠图",vipOnly:!1},{id:"tool_retouch",label:"AI 修图",icon:"修",toolName:"AI 修图",vipOnly:!1},{id:"tool_copy",label:"文案生成",icon:"文",toolName:"文案生成",vipOnly:!1},{id:"tool_poster",label:"海报设计",icon:"海",toolName:"海报设计",vipOnly:!1}],g=[[{id:"t11",name:"护肤品主图套版",desc:"适配淘宝 / 抖店 / 小红书",bg:"linear-gradient(130deg,#ddd9ff,#f9f8ff)",hot:98,createdAt:1716e6},{id:"t12",name:"服饰上新海报",desc:"适合活动促销与新品发布",bg:"linear-gradient(130deg,#d8f2ff,#f4fbff)",hot:86,createdAt:1717e6}],[{id:"t21",name:"零食爆款封面",desc:"强化转化点与价格信息",bg:"linear-gradient(130deg,#ffe3d7,#fff4ea)",hot:93,createdAt:17165e5},{id:"t22",name:"家居场景图",desc:"简约质感，突出生活方式",bg:"linear-gradient(130deg,#e1f1eb,#f2fbf7)",hot:81,createdAt:17174e5}],[{id:"t31",name:"3C 数码详情头图",desc:"更适合参数卖点表达",bg:"linear-gradient(130deg,#dbeafe,#eff6ff)",hot:90,createdAt:17176e5},{id:"t32",name:"节日促销海报",desc:"支持红金氛围快速套版",bg:"linear-gradient(130deg,#ffe4e6,#fff1f2)",hot:79,createdAt:17182e5}]];function k(){return g.flat()}function x(n){return k().find(a=>a.id===n)||null}function c(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function $(){try{const n=localStorage.getItem(T);if(!n)return null;const a=JSON.parse(n);return{...L,...a}}catch{return null}}function r(){try{localStorage.setItem(T,JSON.stringify(t))}catch{}}let t=$()||{...L},E="",e={};function P(){C.innerHTML=`
    <main class="phone" id="phone">
      <div class="status">
        <strong>9:41</strong>
        <span>5G · 100%</span>
      </div>

      <section class="scroll" id="scroll">
        <header class="header">
          <div class="title-row">
            <div class="brand">绘鸟<span>AI</span></div>
            <button class="avatar" id="profileBtn" aria-label="打开个人中心">我</button>
          </div>
          <input id="searchInput" class="search" placeholder="搜索模板、场景、关键词..." />
        </header>

        <!-- Home -->
        <div id="page-home" class="tab-page active" data-tab-page="home">
          <div class="section">
            <div class="hero">
              <h2 id="heroTitle">一键生成电商主图</h2>
              <p id="heroDesc">面向个人创作者与小商家，快速产出高质感商品图和营销物料。</p>
              <button class="cta" id="startCreateBtn" type="button">立即创作</button>
            </div>
          </div>

          <div class="section">
            <div class="title">
              <h3>AI 创作工具</h3>
              <a id="toolAllBtn">全部</a>
            </div>
            <div class="grid" id="toolGrid"></div>
          </div>

          <div class="section">
            <div class="title">
              <h3>热门模板</h3>
              <a id="refreshTemplatesBtn">换一批</a>
            </div>
            <div class="cards" id="cards"></div>
          </div>

          <div class="section">
            <div class="vip">
              <div>
                <h4>开通会员，解锁高清导出</h4>
                <p>无限次生成 · 商用授权 · 私有素材库</p>
              </div>
              <button id="vipBtn" type="button">${t.vipOpened?"已开通":"立即开通"}</button>
            </div>
          </div>
        </div>

        <!-- Template -->
        <div id="page-template" class="tab-page" data-tab-page="template">
          <div class="section">
            <div class="title">
              <h3>模板中心</h3>
              <a id="templateSortBtn">按热度</a>
            </div>
            <div class="cards" id="templatePageCards"></div>
          </div>
        </div>

        <!-- Create -->
        <div id="page-create" class="tab-page" data-tab-page="create">
          <div class="section">
            <div class="title">
              <h3>创作工作台</h3>
              <a id="clearDraftBtn">清空草稿</a>
            </div>
            <div class="notice">
              <span>当前主题：<b id="draftTheme"></b></span>
              <button class="btn" id="draftActionBtn" type="button">生成预览</button>
            </div>
            <div id="createPanel"></div>
          </div>
        </div>

        <!-- Message -->
        <div id="page-message" class="tab-page" data-tab-page="message">
          <div class="section">
            <div class="title">
              <h3>消息中心</h3>
              <a id="markReadBtn">全部已读</a>
            </div>
            <div id="messageList"></div>
          </div>
        </div>

        <!-- Profile -->
        <div id="page-profile" class="tab-page" data-tab-page="profile">
          <div class="section">
            <div class="title">
              <h3>我的</h3>
              <a id="editProfileBtn">编辑资料</a>
            </div>
            <div class="notice">
              <span>账号：<b>${c(t.profile.name)}</b></span>
              <button class="btn" id="logoutBtn" type="button">退出</button>
            </div>
            <div class="notice">
              <span>会员状态：<b id="vipState">${t.vipOpened?"已开通":"未开通"}</b></span>
              <button class="btn" id="openVipFromProfile" type="button">${t.vipOpened?"管理会员":"开通"}</button>
            </div>
          </div>
        </div>
      </section>

      <nav class="tabbar">
        <div class="tab active" data-tab="home"><div class="dot"></div>首页</div>
        <div class="tab" data-tab="template"><div class="dot"></div>模板</div>
        <div class="tab" data-tab="create"><div class="dot"></div>创作</div>
        <div class="tab" data-tab="message"><div class="dot"></div>消息</div>
        <div class="tab" data-tab="profile"><div class="dot"></div>我的</div>
      </nav>

      <div class="toast" id="toast"></div>
      <div class="sheet-mask" id="sheetMask"></div>
      <div class="sheet" id="sheet">
        <h4 id="sheetTitle">开通会员</h4>
        <p id="sheetDesc">解锁全部高级能力与高清导出。</p>
        <div class="sheet-actions">
          <button class="ghost" id="sheetCancelBtn" type="button">稍后再说</button>
          <button class="primary" id="sheetOkBtn" type="button">立即开通</button>
        </div>
      </div>
    </main>
  `,e.phone=document.getElementById("phone"),e.tabs=Array.from(document.querySelectorAll(".tab")),e.pages={home:document.getElementById("page-home"),template:document.getElementById("page-template"),create:document.getElementById("page-create"),message:document.getElementById("page-message"),profile:document.getElementById("page-profile")},e.toast=document.getElementById("toast"),e.searchInput=document.getElementById("searchInput"),e.heroDesc=document.getElementById("heroDesc"),e.startCreateBtn=document.getElementById("startCreateBtn"),e.toolGrid=document.getElementById("toolGrid"),e.cardsEl=document.getElementById("cards"),e.refreshTemplatesBtn=document.getElementById("refreshTemplatesBtn"),e.vipBtn=document.getElementById("vipBtn"),e.toolAllBtn=document.getElementById("toolAllBtn"),e.templatePageCards=document.getElementById("templatePageCards"),e.templateSortBtn=document.getElementById("templateSortBtn"),e.draftTheme=document.getElementById("draftTheme"),e.draftActionBtn=document.getElementById("draftActionBtn"),e.createPanel=document.getElementById("createPanel"),e.clearDraftBtn=document.getElementById("clearDraftBtn"),e.messageList=document.getElementById("messageList"),e.markReadBtn=document.getElementById("markReadBtn"),e.editProfileBtn=document.getElementById("editProfileBtn"),e.logoutBtn=document.getElementById("logoutBtn"),e.openVipFromProfile=document.getElementById("openVipFromProfile"),e.vipState=document.getElementById("vipState"),e.sheetMask=document.getElementById("sheetMask"),e.sheet=document.getElementById("sheet"),e.sheetTitle=document.getElementById("sheetTitle"),e.sheetDesc=document.getElementById("sheetDesc"),e.sheetOkBtn=document.getElementById("sheetOkBtn"),e.sheetCancelBtn=document.getElementById("sheetCancelBtn")}function o(n){e.toast.textContent=n,e.toast.classList.add("show"),clearTimeout(o.timer),o.timer=setTimeout(()=>e.toast.classList.remove("show"),1300)}function b(n){E=n,n==="vip"?(e.sheetTitle.textContent=t.vipOpened?"会员管理":"确认开通会员",e.sheetDesc.textContent=t.vipOpened?"你已是会员，可享受全部高级能力与高清导出。":"开通后可使用全部高级模板、无限导出高清图。",e.sheetOkBtn.textContent=t.vipOpened?"知道了":"立即开通"):n==="logout"&&(e.sheetTitle.textContent="确认退出当前账号",e.sheetDesc.textContent="退出后将返回游客模式，创作记录不会丢失（仅演示）。",e.sheetOkBtn.textContent="确认退出"),e.sheetMask.classList.add("show"),e.sheet.classList.add("show")}function I(){e.sheetMask.classList.remove("show"),e.sheet.classList.remove("show")}function p(n){t.tab=n,e.tabs.forEach(a=>a.classList.toggle("active",a.getAttribute("data-tab")===n)),Object.keys(e.pages).forEach(a=>e.pages[a].classList.toggle("active",a===n)),r()}function w(){return(t.searchKeyword||"").trim().toLowerCase()}function O(n){const a=w();return a?n.filter(s=>(s.name+" "+s.desc).toLowerCase().includes(a)):n}function S(n){const a=n.slice();return t.templateSort==="newest"?a.sort((s,d)=>d.createdAt-s.createdAt):a.sort((s,d)=>d.hot-s.hot),a}function A(n){const a=!!t.favoritedTemplateIds[n.id],s=a?"btn is-favorited":"btn",d=a?"已收藏":"使用";return`
    <article class="card" data-template-id="${n.id}">
      <div class="thumb" style="background:${n.bg}"></div>
      <div class="card-body">
        <div class="meta">
          <h4>${c(n.name)}</h4>
          <p>${c(n.desc)}</p>
        </div>
        <button class="${s}" type="button" data-action="use-template" data-template-use="${n.id}">
          ${d}
        </button>
      </div>
    </article>
  `}function M(){e.toolGrid.innerHTML=u.map((n,a)=>{const s=a+1;return`
        <div class="tool" data-tool-id="${n.id}" style="order:${s}">
          <div class="icon">${c(n.icon)}</div>
          <span>${c(n.label)}</span>
        </div>
      `}).join("")}function y(){const n=g[t.templateGroupIndex]||[],a=O(n),d=(a.length?a:n).slice(0,2);e.cardsEl.innerHTML=d.map(A).join("")}function B(){const n=g[t.templateGroupIndex]?g[t.templateGroupIndex]:g[0],a=O(n.length?n:k()),s=S(a),d=(s.length?s:n).concat(s.length?s:n);e.templatePageCards.innerHTML=d.slice(0,4).map(A).join("")}function h(){const n=t.messages;if(!n.length){e.messageList.innerHTML='<div class="empty-state">暂无消息</div>';return}e.messageList.innerHTML=n.map(a=>{const s=a.read?"已读":"标记已读",d=(a.read,"btn");return`
        <div class="notice" data-msg-id="${a.id}">
          <span style="flex:1">${c(a.text)}</span>
          <button class="${d}" type="button" data-action="toggle-read" data-msg-toggle="${a.id}">
            ${s}
          </button>
        </div>
      `}).join("")}function v(){e.draftTheme.textContent=t.draftTheme;const n=t.generation.status,a=t.generation.last;if(n==="idle"||!a){e.createPanel.innerHTML=`
      <div class="empty-state">
        选择「工具」或点击模板「使用」后，点击「生成预览」即可查看演示结果。
      </div>
    `;return}if(n==="loading"){e.createPanel.innerHTML=`
      <div class="notice">
        <span>正在生成预览...</span>
        <button class="btn" type="button" disabled style="opacity:.6;cursor:not-allowed">生成中</button>
      </div>
      <div class="gen-progress">请稍候，演示生成流程已开始。</div>
    `;return}e.createPanel.innerHTML=`
    <div class="card">
      <div class="thumb" style="background:linear-gradient(130deg,#e9edff,#f9f8ff)"></div>
      <div class="card-body">
        <div class="meta">
          <h4>${c(a.title)}</h4>
          <p>${c(a.desc)}</p>
        </div>
        <button class="btn" type="button" data-action="apply-generated">应用到草稿</button>
      </div>
    </div>
  `}function f(){const n=u.find(a=>a.toolName===t.currentTool)||u[0];e.heroDesc.textContent=`当前工具：「${n.toolName}」，可在创作页继续编辑并导出（演示交互）。`,e.vipBtn.textContent=t.vipOpened?"已开通":"立即开通",e.vipState.textContent=t.vipOpened?"已开通":"未开通",e.draftTheme.textContent=t.draftTheme,e.templateSortBtn.textContent=t.templateSort==="hot"?"按热度":"按最新"}function N(){e.searchInput.value=t.searchKeyword,M(),y(),B(),h(),v(),f(),r()}function G(){e.tabs.forEach(a=>{a.addEventListener("click",()=>p(a.getAttribute("data-tab")))}),e.profileBtn=document.getElementById("profileBtn"),e.profileBtn.addEventListener("click",()=>p("profile")),e.searchInput.addEventListener("keydown",a=>{if(a.key==="Enter"){if(t.searchKeyword=e.searchInput.value.trim(),!t.searchKeyword){o("请输入关键词");return}t.templateGroupIndex=t.templateGroupIndex,y(),B(),f(),r(),o(`搜索：${t.searchKeyword}`)}}),e.startCreateBtn.addEventListener("click",()=>{p("create"),o("已进入创作工作台")}),e.toolAllBtn.addEventListener("click",()=>{p("template"),o("已打开模板中心")}),e.toolGrid.addEventListener("click",a=>{const s=a.target.closest(".tool");if(!s)return;const d=s.getAttribute("data-tool-id"),i=u.find(l=>l.id===d);i&&(t.currentTool=i.toolName,t.draftTheme=i.toolName,t.generation.status="idle",t.generation.last=null,f(),v(),r(),o(`已选择工具：${i.label}`),p("create"))}),e.refreshTemplatesBtn.addEventListener("click",()=>{t.templateGroupIndex=(t.templateGroupIndex+1)%g.length,t.generation.status="idle",t.generation.last=null,f(),y(),B(),o("模板已换一批"),r()});function n(a){a.addEventListener("click",s=>{const d=s.target.closest('button[data-action="use-template"]');if(!d)return;const i=d.getAttribute("data-template-use"),l=x(i);if(!l)return;const m=!t.favoritedTemplateIds[i];t.favoritedTemplateIds[i]=m,t.currentTool=t.currentTool||"电商主图",t.draftTheme=l.name,t.generation.status="idle",t.generation.last=null,f(),y(),B(),v(),o(m?"已收藏并应用模板":"已取消收藏"),p("create"),r()})}n(e.cardsEl),n(e.templatePageCards),e.clearDraftBtn.addEventListener("click",()=>{var a;t.draftTheme=((a=u.find(s=>s.toolName===t.currentTool))==null?void 0:a.toolName)||"电商主图",t.generation.status="idle",t.generation.last=null,v(),o("草稿已清空"),r()}),e.draftActionBtn.addEventListener("click",()=>{const a=u.find(i=>i.toolName===t.currentTool)||u[0];if(t.generation.status==="loading")return;if(a.vipOnly&&!t.vipOpened){o("此功能需要开通会员"),b("vip");return}t.generation.status="loading",v(),r(),o("生成中...");const s=a.label,d=t.draftTheme;window.setTimeout(()=>{t.generation.status="done",t.generation.last={title:`预览完成：${d}`,desc:`基于工具「${s}」生成演示结果（无真实计算）。`};const i="m_"+Math.random().toString(16).slice(2);t.messages=[{id:i,text:`你的「${d}」已生成预览完成`,read:!1},...t.messages],h(),v(),r(),o("生成预览成功")},1200)}),e.createPanel.addEventListener("click",a=>{a.target.closest('button[data-action="apply-generated"]')&&(o("已应用到草稿（演示）"),r())}),e.markReadBtn.addEventListener("click",()=>{t.messages=t.messages.map(a=>({...a,read:!0})),h(),o("已全部标记为已读"),r()}),e.messageList.addEventListener("click",a=>{const s=a.target.closest('button[data-action="toggle-read"]');if(!s)return;const d=s.getAttribute("data-msg-toggle");t.messages=t.messages.map(i=>i.id===d?{...i,read:!i.read}:i),h(),r()}),e.editProfileBtn.addEventListener("click",()=>{o("资料编辑功能开发中（演示）")}),e.logoutBtn.addEventListener("click",()=>b("logout")),e.openVipFromProfile.addEventListener("click",()=>b("vip")),e.vipBtn.addEventListener("click",()=>b("vip")),e.sheetMask.addEventListener("click",I),e.sheetCancelBtn.addEventListener("click",I),e.sheetOkBtn.addEventListener("click",()=>{E==="vip"?(t.vipOpened=!0,o("会员开通成功")):E==="logout"&&(t.vipOpened=!1,o("已退出账号"),t.favoritedTemplateIds=t.favoritedTemplateIds||{}),I(),f(),h(),r()})}function D(){P(),G(),N(),t.tab&&e.pages[t.tab]&&p(t.tab)}D();
