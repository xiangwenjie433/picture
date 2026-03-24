(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const APP_KEY = "huiniao_c_app_state_v2";

  const phone = $("#phone");
  if (!phone) return;

  const toastEl = $("#toast");
  let toastTimer = null;

  const seedCases = [
    { id: "c1", title: "服装套图上新", desc: "同款多角度图组一键出图", cat: "fashion_set", thumb: "t1" },
    { id: "c2", title: "真人换模特大片", desc: "保留服饰细节自动换人像", cat: "real_model", thumb: "t2" },
    { id: "c3", title: "模特换场景海报", desc: "室内外场景快速重组", cat: "model_scene", thumb: "t3" },
    { id: "c4", title: "AI穿衣试搭", desc: "一键试穿多款穿搭组合", cat: "ai_wear", thumb: "t4" },
    { id: "c5", title: "姿势裂变套图", desc: "同服装批量生成不同姿势", cat: "pose", thumb: "t1" },
    { id: "c6", title: "商品套图工厂", desc: "主图详情图活动图整包生成", cat: "product_set", thumb: "t2" },
    { id: "c7", title: "AI视频封面", desc: "短视频封面与标题视觉联动", cat: "ai_video", thumb: "t3" },
    { id: "c8", title: "风格复刻实验室", desc: "输入参考图快速复刻风格", cat: "style_copy", thumb: "t4" },
    { id: "c9", title: "批量生图流程", desc: "百图并行自动裁切下载", cat: "batch", thumb: "t1" },
    { id: "c10", title: "服装套图节日版", desc: "大促主题快速上新", cat: "fashion_set", thumb: "t2" },
    { id: "c11", title: "真人换模特秋装", desc: "多身形模特快速匹配", cat: "real_model", thumb: "t3" },
    { id: "c12", title: "商品套图电商版", desc: "适配多平台图组尺寸", cat: "product_set", thumb: "t4" },
  ];

  const seedMessages = [
    { id: "m1", title: "你的“护肤品主图套版”已生成完成", time: "刚刚", read: false },
    { id: "m2", title: "系统已为你推荐更匹配的模板", time: "5 分钟前", read: false },
    { id: "m3", title: "会员限时活动：首月 6 折", time: "1 小时前", read: true },
  ];

  const defaultState = {
    tab: "home",
    searchKeyword: "",
    activeCaseChip: "all",
    casePage: 1,
    create: {
      uploaded: false,
      fileName: "",
      modePicked: false,
      mode: "服装套图",
      size: "1:1方形",
      clarity: "4K 超清",
      modelLevel: "高级模型",
      prompt: "",
      sourceLabel: "上传服装图",
      sourceImage: "./images/上衣原图.webp",
      sourceImages: [],
    },
    user: {
      name: "演示用户",
      id: "demo_user_001",
      vip: false,
    },
    cases: seedCases,
    messages: seedMessages,
  };

  function cloneDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
  }

  function loadState() {
    try {
      const text = localStorage.getItem(APP_KEY);
      if (!text) return cloneDefaultState();
      const data = JSON.parse(text);
      return {
        ...cloneDefaultState(),
        ...data,
        create: { ...cloneDefaultState().create, ...(data.create || {}) },
        user: { ...cloneDefaultState().user, ...(data.user || {}) },
      };
    } catch (err) {
      return cloneDefaultState();
    }
  }

  const state = loadState();

  function saveState() {
    try {
      localStorage.setItem(APP_KEY, JSON.stringify(state));
    } catch (err) {
      // ignore write failures in private mode/quota
    }
  }

  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1300);
  }

  const tabs = $$(".tab[data-tab]");
  const pages = $$(".page[data-tab-page]");

  function enableMouseDragScroll(el) {
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    el.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
    });

    el.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("is-dragging");
    });

    // 拖动后阻止误触发按钮点击
    el.addEventListener(
      "click",
      (e) => {
        if (!moved) return;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );
  }

  function enableMouseDragPan(el) {
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let moved = false;

    el.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = el.scrollLeft;
      startTop = el.scrollTop;
      el.classList.add("is-dragging");
    });

    el.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      el.scrollLeft = startLeft - dx;
      el.scrollTop = startTop - dy;
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("is-dragging");
    });

    el.addEventListener(
      "click",
      (e) => {
        if (!moved) return;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );
  }

  function setTab(tabName, opts) {
    const options = opts || {};
    tabs.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });
    pages.forEach((page) => {
      page.classList.toggle("active", page.getAttribute("data-tab-page") === tabName);
    });
    state.tab = tabName;
    saveState();
    if (!options.keepScroll) {
      const scroll = $("#scroll");
      if (scroll) scroll.scrollTop = 0;
    }
  }

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function mapChipLabel(key) {
    return (
      {
        all: "全部",
        fashion_set: "服装套图",
        real_model: "真人换模特",
        model_scene: "模特换场景",
        ai_wear: "AI穿衣",
        pose: "姿势裂变",
        product_set: "商品套图",
        ai_video: "AI视频",
        style_copy: "风格复刻",
        batch: "批量生图",
      }[key] || "全部"
    );
  }

  function mapCaseThumbImage(thumb) {
    return (
      {
        t1: "./images/尺码图_1580.jpg",
        t2: "./images/卖点图_1579.jpg",
        t3: "./images/模特图_1577.jpg",
        t4: "./images/种草图_1578.jpg",
      }[thumb] || "./images/尺码图_1580.jpg"
    );
  }

  const AI_ANALYSIS_PROMPT = `### 产品名称：撞色拼接宽松圆领卫衣
### 核心卖点
1. 撞色拼接设计：黑+浅灰+藏蓝的撞色组合，层次丰富，潮流感十足，打破纯色单调感
2. 宽松剪裁：版型宽松不紧绷，适配多种身材，穿着无束缚感
3. 细节质感：下摆处的金属质感布标点缀，提升整体精致度；圆领+罗纹收口设计，贴合身形同时兼顾保暖性与舒适度
4. 舒适面料：亲肤透气的混纺面料，日常穿着柔软舒适，耐穿易打理
### 适用人群
追求潮流休闲风格的年轻男性，涵盖学生、职场通勤人士，也适合微胖身材人群，适配多种身形需求
### 穿戴场景
日常校园生活、职场轻通勤、朋友小聚、户外轻运动、居家休闲等多种生活化场景
### 服装参数
- 材质：棉混纺面料（亲肤透气，兼具柔软度与版型挺括感）
- 颜色：黑底+浅灰+藏蓝撞色
- 尺码：M、L、XL、XXL、XXXL（宽松码数，适配不同身高体重人群）`;

  function renderCases() {
    const listEl = $("#page-template .masonry");
    const filterBtn = $("#caseFilterBtn");
    if (!listEl) return;

    const keyword = (state.searchKeyword || "").trim().toLowerCase();
    let list = state.cases.filter((it) => state.activeCaseChip === "all" || it.cat === state.activeCaseChip);
    if (keyword) {
      list = list.filter((it) => (it.title + " " + it.desc).toLowerCase().includes(keyword));
    }

    const take = state.casePage * 4;
    const showList = list.slice(0, take);
    listEl.innerHTML = showList
      .map(
        (it) =>
          '<article class="m-card" data-case-id="' +
          it.id +
          '" data-case-cat="' +
          it.cat +
          '">' +
          '<div class="m-thumb">' +
          '<img class="m-img" src="' +
          escapeHtml(mapCaseThumbImage(it.thumb)) +
          '" alt="' +
          escapeHtml(it.title) +
          '" />' +
          '<div class="m-product-tag" aria-label="商品">' +
          '<img class="m-product-icon" src="./images/上衣原图.webp" alt="上衣原图" />' +
          "<span>商品</span>" +
          "</div>" +
          '<div class="hot-hover-overlay">' +
          '<div class="hot-hover-actions">' +
          '<button class="hot-act-btn hot-preview-btn" type="button" data-action="preview" aria-label="预览">' +
          '<img class="hot-eye-icon" src="./images/眼睛-3.png" alt="" width="22" height="22" />' +
          '<span class="hot-preview-btn-text">预览</span>' +
          "</button>" +
          '<button class="hot-act-btn primary hot-make-btn" type="button" data-action="make">制作同款</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</article>"
      )
      .join("");

    if (filterBtn) filterBtn.textContent = "筛选：" + mapChipLabel(state.activeCaseChip);
    $$(".chip[data-chip]").forEach((chip) => {
      chip.classList.toggle("active", chip.getAttribute("data-chip") === state.activeCaseChip);
    });

    const loadBtn = $("#loadMoreCasesBtn");
    if (loadBtn) {
      const hasMore = showList.length < list.length;
      loadBtn.style.display = hasMore ? "block" : "none";
      loadBtn.textContent = "...";
      loadBtn.setAttribute("aria-label", "继续下滑自动加载更多案例");
      loadBtn.setAttribute("data-has-more", hasMore ? "1" : "0");
    }
  }

  function renderMessages() {
    const msgList = $("#msgList");
    if (!msgList) return;
    if (!state.messages.length) {
      msgList.innerHTML = '<div class="empty-state">暂无消息</div>';
      return;
    }
    msgList.innerHTML = state.messages
      .map(
        (m) =>
          '<div class="msg-item" data-msg-id="' +
          m.id +
          '"><div class="msg-dot ' +
          (m.read ? "" : "unread") +
          '"></div><div class="msg-body"><div class="msg-title">' +
          escapeHtml(m.title) +
          '</div><div class="msg-time">' +
          escapeHtml(m.time) +
          "</div></div></div>"
      )
      .join("");
  }

  function renderCreate() {
    const createPage = $("#page-create");
    const modeGate = $("#createModeGate");
    const uploadBox = $("#uploadBox");
    const uploadHint = $("#createUploadHint");
    const title = uploadBox ? uploadBox.querySelector(".upload-title") : null;
    const desc = uploadBox ? uploadBox.querySelector(".upload-desc") : null;
    const uploadPreviewList = $("#uploadPreviewList");
    const mode = $("#createMode");
    const modePickButtons = $$("#createModeGate [data-create-mode-pick]");
    const size = $("#createSize");
    const clarity = $("#createClarity");
    const modelLevel = $("#createModel");
    const prompt = $("#createPrompt");

    if (uploadBox) {
      uploadBox.style.borderStyle = state.create.uploaded ? "solid" : "dashed";
      uploadBox.style.borderColor = state.create.uploaded ? "#c7d2fe" : "#d5dbea";
      uploadBox.classList.toggle("has-images", !!(state.create.sourceImages && state.create.sourceImages.length));
    }
    if (title) title.textContent = state.create.uploaded ? "" : "上传原图";
    if (desc) desc.textContent = state.create.uploaded ? "原图已就绪，可继续生成预览。" : "支持 JPG / PNG，建议 1200px 以上";
    if (mode) mode.value = state.create.mode;
    modePickButtons.forEach((btn) => {
      btn.classList.toggle("active", (btn.getAttribute("data-create-mode-pick") || "") === state.create.mode);
    });
    if (size) size.value = state.create.size;
    if (clarity) clarity.value = state.create.clarity || "4K 超清";
    if (modelLevel) modelLevel.value = state.create.modelLevel || "高级模型";
    if (prompt) prompt.value = state.create.prompt;
    if (uploadHint) uploadHint.style.display = state.create.uploaded ? "block" : "none";
    if (uploadPreviewList) {
      const imgs = (state.create.sourceImages || []).slice(0, 3);
      uploadPreviewList.innerHTML = imgs
        .map(
          (src, idx) =>
            '<div class="upload-preview-item"><img src="' +
            escapeHtml(src) +
            '" alt="上传预览" /><button class="upload-preview-remove" type="button" data-remove-upload-index="' +
            idx +
            '" aria-label="删除图片">×</button></div>'
        )
        .join("");
      uploadPreviewList.style.display = imgs.length ? "grid" : "none";
    }
    const needPickMode = !state.create.modePicked;
    if (createPage) createPage.classList.toggle("mode-required", needPickMode);
    if (modeGate) {
      modeGate.style.display = needPickMode ? "block" : "none";
      modeGate.setAttribute("aria-hidden", needPickMode ? "false" : "true");
    }
  }

  function renderProfile() {
    const avatar = $("#page-profile .profile-avatar");
    const nameEl = $("#page-profile .profile-info h3");
    const idEl = $("#page-profile .profile-info p");
    const vipBtn = $("#openVipBtn");
    const vipDesc = $("#page-profile .vip-text p");

    if (avatar) avatar.textContent = (state.user.name || "演").slice(0, 1);
    if (nameEl) nameEl.textContent = state.user.name;
    if (idEl) idEl.textContent = "ID: " + state.user.id;
    if (vipBtn) vipBtn.textContent = state.user.vip ? "已开通" : "立即开通";
    if (vipDesc) {
      vipDesc.textContent = state.user.vip ? "你已开通会员，支持高清导出与批量处理" : "解锁高清导出、批量处理、商用授权";
    }
  }

  function renderAll() {
    renderCases();
    renderMessages();
    renderCreate();
    renderProfile();
    const searchInput = $("#searchInput");
    if (searchInput) searchInput.value = state.searchKeyword;
  }

  // Tab
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.getAttribute("data-tab") || "home"));
  });

  // Search
  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const kw = (searchInput.value || "").trim();
      state.searchKeyword = kw;
      state.casePage = 1;
      saveState();
      renderCases();
      showToast(kw ? "筛选关键词：" + kw : "已清除搜索关键词");
    });
  }

  // Home quick actions
  const profileBtn = $("#profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      setTab("profile");
      showToast("打开个人中心");
    });
  }
  const startCreateBtn = $("#startCreateBtn");
  if (startCreateBtn) startCreateBtn.addEventListener("click", () => setTab("create"));

  const viewCasesBtn = $("#viewCasesBtn");
  if (viewCasesBtn) viewCasesBtn.addEventListener("click", () => setTab("template"));

  const moreIndustryBtn = $("#moreIndustryBtn");
  if (moreIndustryBtn) moreIndustryBtn.addEventListener("click", () => showToast("查看更多行业案例"));

  const featureGrid = $("#featureGrid");
  if (featureGrid) {
    featureGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".tool-item[data-feature], .feature-card[data-feature]");
      if (!card) return;
      const featureToMode = {
        fitting: "模特换装",
        product: "电商主图",
        pose: "姿势裂变",
      };
      const key = card.getAttribute("data-feature") || "product";
      state.create.mode = featureToMode[key] || "电商主图";
      saveState();
      renderCreate();
      setTab("create");
      showToast("已选择能力：" + state.create.mode);
    });

    const pagerDots = $$("#toolPager .dot");
    const pageCount = Math.max(pagerDots.length, 1);
    const goToolPage = (pageIndex) => {
      const nextPage = Math.max(0, Math.min(pageCount - 1, pageIndex));
      featureGrid.scrollTo({
        left: nextPage * featureGrid.clientWidth,
        behavior: "smooth",
      });
    };
    const updateToolPager = () => {
      if (!pagerDots.length) return;
      const page = Math.round(featureGrid.scrollLeft / Math.max(featureGrid.clientWidth, 1));
      pagerDots.forEach((dot, idx) => dot.classList.toggle("active", idx === page));
    };
    featureGrid.addEventListener("scroll", updateToolPager, { passive: true });

    // 触摸滑动翻页（向左下一页，向右上一页）
    let touchStartX = 0;
    let touchStartY = 0;
    featureGrid.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || !e.touches.length) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    featureGrid.addEventListener(
      "touchend",
      (e) => {
        if (!e.changedTouches || !e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return;
        const currentPage = Math.round(featureGrid.scrollLeft / Math.max(featureGrid.clientWidth, 1));
        goToolPage(currentPage + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );

    pagerDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => goToolPage(idx));
    });
    updateToolPager();
  }

  // Home inspiration tabs filter
  const inspireTabs = $("#inspireTabs");
  const inspireFeed = $("#inspireFeed");
  enableMouseDragScroll(inspireTabs);
  if (inspireTabs && inspireFeed) {
    const feedCards = Array.from(inspireFeed.querySelectorAll(".feed-card[data-feed-cat]"));
    const mainTabs = Array.from(inspireTabs.querySelectorAll(".inspire-tab[data-inspire-filter]"));

    const setActiveFilter = (filterKey) => {
      const key = filterKey || "all";
      mainTabs.forEach((btn) => btn.classList.toggle("active", (btn.getAttribute("data-inspire-filter") || "") === key));

      let visible = 0;
      feedCards.forEach((card) => {
        const cat = card.getAttribute("data-feed-cat") || "";
        const show = key === "all" || key === cat;
        card.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });

      let empty = inspireFeed.querySelector(".empty-state.inspire-empty");
      if (!visible) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "empty-state inspire-empty";
          empty.textContent = "当前分类暂无灵感";
          inspireFeed.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    };

    inspireTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".inspire-tab[data-inspire-filter]");
      if (!btn) return;
      setActiveFilter(btn.getAttribute("data-inspire-filter") || "all");
    });

    setActiveFilter("all");
  }

  // Tool promotion carousel
  const toolPromoCarousel = $("#toolPromoCarousel");
  if (toolPromoCarousel) {
    const track = toolPromoCarousel.querySelector(".tool-carousel-track");
    const pager = $("#toolPromoPager");
    const slides = track ? Array.from(track.querySelectorAll(".tool-slide")) : [];
    if (track && pager && slides.length) {
      pager.innerHTML = slides
        .map((_, idx) => '<span class="dot' + (idx === 0 ? " active" : "") + '" data-index="' + idx + '"></span>')
        .join("");

      const dots = Array.from(pager.querySelectorAll(".dot"));
      let current = 0;
      let timer = null;
      let touchStartX = 0;
      let touchStartY = 0;

      const setActive = (next) => {
        current = Math.max(0, Math.min(slides.length - 1, next));
        track.scrollTo({ left: current * track.clientWidth, behavior: "smooth" });
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
      };

      const syncByScroll = () => {
        const idx = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
        if (idx === current) return;
        current = idx;
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
      };

      const startAuto = () => {
        clearInterval(timer);
        timer = setInterval(() => {
          setActive((current + 1) % slides.length);
        }, 2800);
      };

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const idx = Number(dot.getAttribute("data-index") || 0);
          setActive(idx);
          startAuto();
        });
      });

      track.addEventListener("scroll", syncByScroll, { passive: true });
      track.addEventListener(
        "touchstart",
        (e) => {
          if (!e.touches || !e.touches.length) return;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );
      track.addEventListener(
        "touchend",
        (e) => {
          if (!e.changedTouches || !e.changedTouches.length) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(dx) < 32 || Math.abs(dx) < Math.abs(dy)) return;
          setActive(current + (dx < 0 ? 1 : -1));
          startAuto();
        },
        { passive: true }
      );

      startAuto();
    }
  }

  // Hot rank list actions (热门案例：预览 / 制作同款)
  const hotScroll = $(".hot-scroll");
  if (hotScroll) {
    // 预览弹窗元素
    const hotPreviewMask = $("#hotPreviewMask");
    const hotPreviewModal = $("#hotPreviewModal");
    const hotPreviewCloseBtn = $("#hotPreviewCloseBtn");
    const hotPreviewBeforeImg = $("#hotPreviewBeforeImg");
    const hotPreviewAfterImg = $("#hotPreviewAfterImg");
    const hotPreviewTitle = $(".hot-preview-title");

    let hotTouchTimer = null;

    function openHotPreview(title, beforeSrc, afterSrc) {
      if (!hotPreviewMask || !hotPreviewModal) return;
      if (hotPreviewTitle) hotPreviewTitle.textContent = title || "预览";
      if (hotPreviewBeforeImg) {
        hotPreviewBeforeImg.src = beforeSrc;
        hotPreviewBeforeImg.style.clipPath = "";
      }
      if (hotPreviewAfterImg) hotPreviewAfterImg.src = afterSrc;
      hotPreviewMask.classList.add("show");
      hotPreviewModal.classList.add("show");
      hotPreviewMask.setAttribute("aria-hidden", "false");
      hotPreviewModal.setAttribute("aria-hidden", "false");
    }

    function closeHotPreview() {
      if (!hotPreviewMask || !hotPreviewModal) return;
      hotPreviewMask.classList.remove("show");
      hotPreviewModal.classList.remove("show");
      hotPreviewMask.setAttribute("aria-hidden", "true");
      hotPreviewModal.setAttribute("aria-hidden", "true");
    }

    if (hotPreviewCloseBtn) hotPreviewCloseBtn.addEventListener("click", closeHotPreview);
    if (hotPreviewMask) hotPreviewMask.addEventListener("click", closeHotPreview);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeHotPreview();
    });

    // 移动端触摸：临时显示覆盖层（模拟 hover）
    hotScroll.addEventListener(
      "touchstart",
      (e) => {
        const card = e.target.closest(".hot-card");
        if (!card) return;
        const thumb = card.querySelector(".hot-thumb");
        if (!thumb) return;
        thumb.classList.add("is-touch");
        clearTimeout(hotTouchTimer);
        hotTouchTimer = setTimeout(() => thumb.classList.remove("is-touch"), 2600);
      },
      { passive: true }
    );

    hotScroll.addEventListener("click", (e) => {
      const btn = e.target.closest(".hot-act-btn[data-action]");
      if (!btn) return;

      const card = e.target.closest(".hot-card[data-hot-kind]");
      if (!card) return;

      const action = btn.getAttribute("data-action") || "";
      const kind = card.getAttribute("data-hot-kind") || "案例";
      const modeKey = card.getAttribute("data-hot-mode") || "product";

      if (action === "preview") {
        const beforeSrc = "./images/上衣原图.webp";
        const afterImg = card.querySelector("img.hot-img");
        const afterSrc = (afterImg && afterImg.getAttribute("src")) || "";
        openHotPreview(kind + " 预览", beforeSrc, afterSrc);
        return;
      }

      if (action === "make") {
        const modeMap = {
          product: "电商主图",
          fitting: "模特换装",
          pose: "姿势裂变",
        };
        state.create.mode = modeMap[modeKey] || "电商主图";
        saveState();
        renderCreate();
        setTab("create");
        showToast("已制作同款：" + kind);
      }
    });
  }

  // Case tab
  const caseChips = $("#caseChips");
  enableMouseDragScroll(caseChips);
  if (caseChips) {
    caseChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip[data-chip]");
      if (!chip) return;
      state.activeCaseChip = chip.getAttribute("data-chip") || "all";
      state.casePage = 1;
      saveState();
      renderCases();
      showToast("案例筛选：" + mapChipLabel(state.activeCaseChip));
    });
  }
  const loadMoreCasesBtn = $("#loadMoreCasesBtn");
  const scrollEl = $("#scroll");
  let caseAutoLoading = false;
  function tryAutoLoadCases() {
    if (!scrollEl || !loadMoreCasesBtn || caseAutoLoading) return;
    if (state.tab !== "template") return;
    if (loadMoreCasesBtn.getAttribute("data-has-more") !== "1") return;

    const scrollRect = scrollEl.getBoundingClientRect();
    const loadRect = loadMoreCasesBtn.getBoundingClientRect();
    const nearBottom = loadRect.top - scrollRect.bottom < 80;
    if (!nearBottom) return;

    caseAutoLoading = true;
    state.casePage += 1;
    saveState();
    renderCases();
    window.setTimeout(() => {
      caseAutoLoading = false;
      tryAutoLoadCases();
    }, 160);
  }
  if (scrollEl) {
    scrollEl.addEventListener("scroll", tryAutoLoadCases, { passive: true });
  }
  const caseMasonry = $("#page-template .masonry");
  if (caseMasonry) {
    let caseTouchTimer = null;
    caseMasonry.addEventListener(
      "touchstart",
      (e) => {
        const card = e.target.closest(".m-card");
        if (!card) return;
        const thumb = card.querySelector(".m-thumb");
        if (!thumb) return;
        thumb.classList.add("is-touch");
        clearTimeout(caseTouchTimer);
        caseTouchTimer = setTimeout(() => thumb.classList.remove("is-touch"), 2600);
      },
      { passive: true }
    );

    caseMasonry.addEventListener("click", (e) => {
      const btn = e.target.closest(".hot-act-btn[data-action]");
      if (!btn) return;

      const card = e.target.closest(".m-card[data-case-id]");
      if (!card) return;
      const id = card.getAttribute("data-case-id");
      const hit = state.cases.find((it) => it.id === id);
      if (!hit) return;

      const action = btn.getAttribute("data-action") || "";
      if (action === "preview") {
        const hotPreviewMask = $("#hotPreviewMask");
        const hotPreviewModal = $("#hotPreviewModal");
        const hotPreviewBeforeImg = $("#hotPreviewBeforeImg");
        const hotPreviewAfterImg = $("#hotPreviewAfterImg");
        const hotPreviewTitle = $(".hot-preview-title");
        const afterImg = card.querySelector("img.m-img");
        const afterSrc = (afterImg && afterImg.getAttribute("src")) || "";
        if (hotPreviewTitle) hotPreviewTitle.textContent = hit.title + " 预览";
        if (hotPreviewBeforeImg) {
          hotPreviewBeforeImg.src = "./images/上衣原图.webp";
          hotPreviewBeforeImg.style.clipPath = "";
        }
        if (hotPreviewAfterImg) hotPreviewAfterImg.src = afterSrc;
        if (hotPreviewMask && hotPreviewModal) {
          hotPreviewMask.classList.add("show");
          hotPreviewModal.classList.add("show");
          hotPreviewMask.setAttribute("aria-hidden", "false");
          hotPreviewModal.setAttribute("aria-hidden", "false");
        }
        return;
      }

      if (action === "make") {
        const modeMap = {
          fashion_set: "电商主图",
          real_model: "模特换装",
          model_scene: "场景重构",
          ai_wear: "模特换装",
          pose: "姿势裂变",
          product_set: "电商主图",
          ai_video: "电商主图",
          style_copy: "场景重构",
          batch: "电商主图",
        };
        state.create.mode = modeMap[hit.cat] || "电商主图";
        saveState();
        renderCreate();
        setTab("create");
        showToast("已制作同款：" + hit.title);
      }
    });
  }

  // Create tab
  const createMode = $("#createMode");
  const createSize = $("#createSize");
  const createClarity = $("#createClarity");
  const createModelLevel = $("#createModel");
  const createPrompt = $("#createPrompt");
  const createModeGate = $("#createModeGate");
  const createModeOptions = $("#createModeOptions");
  const mockUploadBtn = $("#mockUploadBtn");
  const uploadPlusBtn = $("#uploadPlusBtn");
  const localImageInput = $("#localImageInput");
  const uploadPreviewList = $("#uploadPreviewList");
  const aiAnalyzeBtn = $("#aiAnalyzeBtn");
  const inputGuideBtn = $("#inputGuideBtn");
  const startGenerateBtn = $("#startGenerateBtn");
  const brandModalMask = $("#brandModalMask");
  const brandModal = $("#brandModal");
  const brandModalCloseBtn = $("#brandModalCloseBtn");
  const brandModalConfirmBtn = $("#brandModalConfirmBtn");
  const mainSubPanel = $(".main-sub-panel");
  const mainSubToggle = $("#mainSubToggle");
  const mainSubInfoBtn = $("#mainSubInfoBtn");
  const mainSubInfoPop = $("#mainSubInfoPop");
  const mainSubBody = $("#mainSubBody");
  const pickSceneBtn = $("#pickSceneBtn");
  const pickModelBtn = $("#pickModelBtn");
  const mainSubPickerMask = $("#mainSubPickerMask");
  const mainSubPickerModal = $("#mainSubPickerModal");
  const mainSubPickerTitle = $("#mainSubPickerTitle");
  const mainSubPickerList = $("#mainSubPickerList");
  const mainSubPickerCloseBtn = $("#mainSubPickerCloseBtn");
  const mainSubPickerConfirmBtn = $("#mainSubPickerConfirmBtn");
  const resetCreateBtn = $("#resetCreateBtn");
  const previewBtn = $("#previewBtn");
  const exportBtn = $("#exportBtn");
  const exportAllBtn = $("#exportAllBtn");
  const createResultMeta = $("#createResultMeta");
  const createResultList = $("#createResultList");
  const resultDetailMask = $("#resultDetailMask");
  const resultDetailModal = $("#resultDetailModal");
  const resultDetailTitle = $("#resultDetailTitle");
  const resultDetailImg = $("#resultDetailImg");
  const resultDetailCloseBtn = $("#resultDetailCloseBtn");
  const resultDetailDownloadBtn = $("#resultDetailDownloadBtn");
  const createPowerHint = $("#createPowerHint");
  let selectedBrandSources = [];
  let generatedResults = [];
  let activeResultDetail = null;
  let progressTimer = null;
  const mainSubState = {
    enabled: true,
    types: {
      model: { checked: false, count: 0 },
      seed: { checked: false, count: 0 },
      selling: { checked: false, count: 0 },
      size: { checked: false, count: 0 },
      white: { checked: false, count: 0 },
    },
    sceneSelected: [],
    modelSelected: [],
  };
  const sceneOptions = ["城市街景", "室内棚拍", "居家场景", "户外运动", "咖啡店"];
  const modelOptions = ["亚洲女模", "欧美女模", "亚洲男模", "欧美男模", "童模"];
  let pickerKind = "";
  let pickerSelected = [];

  function getPowerPerImage() {
    const modelLevel = state.create.modelLevel || "高级模型";
    const clarity = state.create.clarity || "4K 超清";
    if (modelLevel === "基础模型") return 20;
    if (clarity === "4K 超清") return 80;
    return 40;
  }

  function getMainSubImageCount() {
    if (!mainSubState.enabled) return 0;
    return Object.values(mainSubState.types).reduce((sum, item) => (item.checked ? sum + item.count : sum), 0);
  }

  function typeLabelByKey(key) {
    return (
      {
        model: "模特图",
        seed: "种草图",
        selling: "卖点图",
        size: "尺码图",
        white: "白底图",
      }[key] || "结果图"
    );
  }

  function downloadImage(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "image.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function renderGeneratedResults() {
    if (!createResultList) return;
    if (!generatedResults.length) {
      createResultList.innerHTML = '<div class="result-empty"></div>';
      if (createResultMeta) createResultMeta.textContent = "";
      return;
    }
    if (createResultMeta) {
      createResultMeta.textContent =
        new Date().toLocaleString("zh-CN", { hour12: false }) + "  任务ID: " + (Date.now() % 10000);
    }
    createResultList.innerHTML = generatedResults
      .map(
        (it, idx) =>
          '<article class="result-card" data-result-index="' +
          idx +
          '">' +
          '<span class="result-card-type">' +
          escapeHtml(it.typeLabel) +
          "</span>" +
          '<img src="' +
          escapeHtml(it.src) +
          '" alt="' +
          escapeHtml(it.typeLabel) +
          '" />' +
          '<div class="result-card-mask"></div>' +
          (it.status === "generating"
            ? '<div class="result-card-progress-wrap"><div class="result-card-progress-text">创作中 ' +
              it.progress +
              '%</div><div class="result-card-progress"><i style="width:' +
              it.progress +
              '%"></i></div></div>'
            : '<button class="result-card-view" type="button" data-result-action="detail"><svg class="result-card-eye" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C6.5 5 2.1 8.3.6 12c1.5 3.7 5.9 7 11.4 7s9.9-3.3 11.4-7C21.9 8.3 17.5 5 12 5zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.8z"/></svg><span>查看详情</span></button><button class="result-card-download" type="button" data-result-action="download">下载</button>') +
          "</article>"
      )
      .join("");
  }

  function startResultProgress() {
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      let allDone = true;
      generatedResults = generatedResults.map((item) => {
        if (item.status !== "generating") return item;
        const next = Math.min(100, item.progress + Math.floor(Math.random() * 18 + 8));
        const done = next >= 100;
        if (!done) allDone = false;
        return { ...item, progress: next, status: done ? "done" : "generating" };
      });
      renderGeneratedResults();
      if (allDone) {
        clearInterval(progressTimer);
        progressTimer = null;
        showToast("全部图片创作完成");
      }
    }, 700);
  }

  function openResultDetail(item) {
    if (!item || !resultDetailMask || !resultDetailModal) return;
    activeResultDetail = item;
    if (resultDetailTitle) resultDetailTitle.textContent = item.typeLabel + " 详情";
    if (resultDetailImg) resultDetailImg.src = item.src;
    resultDetailMask.classList.add("show");
    resultDetailModal.classList.add("show");
    resultDetailMask.setAttribute("aria-hidden", "false");
    resultDetailModal.setAttribute("aria-hidden", "false");
  }

  function closeResultDetail() {
    if (!resultDetailMask || !resultDetailModal) return;
    resultDetailMask.classList.remove("show");
    resultDetailModal.classList.remove("show");
    resultDetailMask.setAttribute("aria-hidden", "true");
    resultDetailModal.setAttribute("aria-hidden", "true");
  }

  function syncPowerUI() {
    const totalImages = getMainSubImageCount();
    const perImage = getPowerPerImage();
    const totalPower = totalImages * perImage;
    if (createPowerHint) {
      createPowerHint.textContent = `主副图${totalImages}张 * 每张${perImage}点 = ${totalPower}点`;
    }
    if (previewBtn) {
      previewBtn.textContent = `开始生成(${totalPower}算力)`;
      previewBtn.disabled = totalImages <= 0;
    }
  }

  enableMouseDragScroll(createModeOptions);
  enableMouseDragPan(createPrompt);

  function syncMainSubUI() {
    if (!mainSubPanel) return;
    mainSubPanel.classList.toggle("collapsed", !mainSubState.enabled);
    if (mainSubToggle) mainSubToggle.checked = mainSubState.enabled;
    if (mainSubBody) mainSubBody.style.display = mainSubState.enabled ? "block" : "none";
    Object.keys(mainSubState.types).forEach((key) => {
      const row = $(`[data-type-row="${key}"]`);
      const check = $(`[data-type-check="${key}"]`);
      const value = $(`[data-count-value="${key}"]`);
      const minus = $(`[data-count-action="minus"][data-count-type="${key}"]`);
      const plus = $(`[data-count-action="plus"][data-count-type="${key}"]`);
      const countBox = row ? row.querySelector(".main-sub-count") : null;
      const item = mainSubState.types[key];
      if (item.checked && item.count < 1) item.count = 1;
      if (!item.checked) item.count = 0;
      if (row) {
        row.classList.toggle("checked", item.checked);
        row.classList.toggle("disabled", !item.checked);
      }
      if (countBox) countBox.classList.toggle("hidden", !item.checked);
      if (check) check.checked = item.checked;
      if (value) value.textContent = String(item.count);
      if (minus) minus.disabled = !item.checked;
      if (plus) plus.disabled = !item.checked;
    });
    if (pickSceneBtn) {
      pickSceneBtn.classList.toggle("active", mainSubState.sceneSelected.length > 0);
      pickSceneBtn.textContent = mainSubState.sceneSelected.length
        ? `场景：已选${mainSubState.sceneSelected.length}项`
        : "+ 场景（可选）";
    }
    if (pickModelBtn) {
      pickModelBtn.classList.toggle("active", mainSubState.modelSelected.length > 0);
      pickModelBtn.textContent = mainSubState.modelSelected.length
        ? `模特：已选${mainSubState.modelSelected.length}项`
        : "+ 模特（可选）";
    }
    syncPowerUI();
  }

  function openMainSubPicker(kind) {
    if (!mainSubPickerMask || !mainSubPickerModal || !mainSubPickerList || !mainSubPickerTitle) return;
    pickerKind = kind;
    const options = kind === "scene" ? sceneOptions : modelOptions;
    pickerSelected = Array.from(kind === "scene" ? mainSubState.sceneSelected : mainSubState.modelSelected);
    mainSubPickerTitle.textContent = kind === "scene" ? "选择场景" : "选择模特";
    mainSubPickerList.innerHTML = options
      .map(
        (name) =>
          `<button class="brand-item ${pickerSelected.includes(name) ? "selected" : ""}" type="button" data-main-sub-pick="${escapeHtml(
            name
          )}"><span>${escapeHtml(name)}</span></button>`
      )
      .join("");
    mainSubPickerMask.classList.add("show");
    mainSubPickerModal.classList.add("show");
    mainSubPickerMask.setAttribute("aria-hidden", "false");
    mainSubPickerModal.setAttribute("aria-hidden", "false");
  }

  function closeMainSubPicker() {
    if (!mainSubPickerMask || !mainSubPickerModal) return;
    mainSubPickerMask.classList.remove("show");
    mainSubPickerModal.classList.remove("show");
    mainSubPickerMask.setAttribute("aria-hidden", "true");
    mainSubPickerModal.setAttribute("aria-hidden", "true");
  }

  if (mainSubToggle) {
    mainSubToggle.addEventListener("change", () => {
      mainSubState.enabled = !!mainSubToggle.checked;
      syncMainSubUI();
    });
  }
  function closeMainSubInfo() {
    if (!mainSubInfoPop) return;
    mainSubInfoPop.classList.remove("show");
    mainSubInfoPop.setAttribute("aria-hidden", "true");
  }
  if (mainSubInfoBtn) {
    mainSubInfoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!mainSubInfoPop) return;
      const willShow = !mainSubInfoPop.classList.contains("show");
      mainSubInfoPop.classList.toggle("show", willShow);
      mainSubInfoPop.setAttribute("aria-hidden", willShow ? "false" : "true");
    });
  }
  if (mainSubInfoPop) {
    mainSubInfoPop.addEventListener("click", (e) => e.stopPropagation());
  }
  document.addEventListener("click", closeMainSubInfo);
  if (mainSubBody) {
    mainSubBody.addEventListener("change", (e) => {
      const check = e.target.closest("[data-type-check]");
      if (!check) return;
      const key = check.getAttribute("data-type-check") || "";
      if (!mainSubState.types[key]) return;
      mainSubState.types[key].checked = !!check.checked;
      if (check.checked && mainSubState.types[key].count < 1) mainSubState.types[key].count = 1;
      if (!check.checked) mainSubState.types[key].count = 0;
      syncMainSubUI();
    });
    mainSubBody.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-count-action][data-count-type]");
      if (!btn) return;
      const key = btn.getAttribute("data-count-type") || "";
      const action = btn.getAttribute("data-count-action") || "";
      const item = mainSubState.types[key];
      if (!item || !item.checked) return;
      if (action === "minus") item.count = Math.max(1, item.count - 1);
      if (action === "plus") item.count = Math.min(4, item.count + 1);
      syncMainSubUI();
    });
  }
  if (pickSceneBtn) {
    pickSceneBtn.addEventListener("click", () => openMainSubPicker("scene"));
  }
  if (pickModelBtn) {
    pickModelBtn.addEventListener("click", () => openMainSubPicker("model"));
  }
  if (mainSubPickerCloseBtn) mainSubPickerCloseBtn.addEventListener("click", closeMainSubPicker);
  if (mainSubPickerMask) mainSubPickerMask.addEventListener("click", closeMainSubPicker);
  if (mainSubPickerList) {
    mainSubPickerList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-main-sub-pick]");
      if (!btn) return;
      const name = btn.getAttribute("data-main-sub-pick") || "";
      const idx = pickerSelected.indexOf(name);
      if (idx >= 0) {
        pickerSelected.splice(idx, 1);
        btn.classList.remove("selected");
      } else {
        pickerSelected.push(name);
        btn.classList.add("selected");
      }
    });
  }
  if (mainSubPickerConfirmBtn) {
    mainSubPickerConfirmBtn.addEventListener("click", () => {
      if (pickerKind === "scene") mainSubState.sceneSelected = Array.from(pickerSelected);
      if (pickerKind === "model") mainSubState.modelSelected = Array.from(pickerSelected);
      syncMainSubUI();
      closeMainSubPicker();
      showToast("已更新可选项");
    });
  }
  syncMainSubUI();

  if (createMode) {
    createMode.addEventListener("change", () => {
      state.create.modePicked = true;
      state.create.mode = createMode.value;
      saveState();
      renderCreate();
    });
  }
  if (createModeGate) {
    createModeGate.addEventListener("click", (e) => {
      const pickBtn = e.target.closest("[data-create-mode-pick]");
      if (!pickBtn) return;
      const modeName = pickBtn.getAttribute("data-create-mode-pick") || "电商主图";
      state.create.mode = modeName;
      state.create.modePicked = true;
      saveState();
      renderCreate();
      showToast("已选择模式：" + modeName);
    });
  }
  if (createSize) {
    createSize.addEventListener("change", () => {
      state.create.size = createSize.value;
      saveState();
    });
  }
  if (createClarity) {
    createClarity.addEventListener("change", () => {
      state.create.clarity = createClarity.value;
      saveState();
      syncPowerUI();
    });
  }
  if (createModelLevel) {
    createModelLevel.addEventListener("change", () => {
      state.create.modelLevel = createModelLevel.value;
      saveState();
      syncPowerUI();
    });
  }
  if (createPrompt) {
    createPrompt.addEventListener("input", () => {
      state.create.prompt = createPrompt.value;
      saveState();
    });
  }
  if (aiAnalyzeBtn) {
    aiAnalyzeBtn.addEventListener("click", () => {
      if (!state.create.uploaded) {
        showToast("请先上传图片后再进行AI分析");
        return;
      }
      state.create.prompt = AI_ANALYSIS_PROMPT;
      saveState();
      renderCreate();
      aiAnalyzeBtn.classList.add("active");
      if (inputGuideBtn) inputGuideBtn.classList.remove("active");
      showToast("AI分析内容已生成");
    });
  }
  if (inputGuideBtn) {
    inputGuideBtn.addEventListener("click", () => {
      inputGuideBtn.classList.add("active");
      if (aiAnalyzeBtn) aiAnalyzeBtn.classList.remove("active");
      showToast("已切换输入向导");
    });
  }
  if (mockUploadBtn) {
    mockUploadBtn.addEventListener("click", () => {
      if (!state.create.modePicked) {
        showToast("请先选择创作模式");
        return;
      }
      showToast("请点击下方加号选择本地图片");
    });
  }
  if (uploadPlusBtn) {
    uploadPlusBtn.addEventListener("click", () => {
      if (!state.create.modePicked) {
        showToast("请先选择创作模式");
        return;
      }
      if (localImageInput) localImageInput.click();
    });
  }
  if (localImageInput) {
    localImageInput.addEventListener("change", () => {
      const files = Array.from(localImageInput.files || []).slice(0, 3);
      if (!files.length) return;
      const existing = Array.from(state.create.sourceImages || []);
      const remain = Math.max(0, 3 - existing.length);
      if (remain <= 0) {
        showToast("最多上传3张，请先删除后再上传");
        localImageInput.value = "";
        return;
      }
      const nextFiles = files.slice(0, remain);
      const fileUrls = nextFiles.map((file) => URL.createObjectURL(file));
      const merged = existing.concat(fileUrls).slice(0, 3);
      state.create.uploaded = true;
      state.create.fileName = "";
      state.create.sourceLabel = "local";
      state.create.sourceImage = merged[0] || "./images/上衣原图.webp";
      state.create.sourceImages = merged;
      saveState();
      renderCreate();
      if (files.length > nextFiles.length) {
        showToast("已追加" + nextFiles.length + "张，最多保留3张");
      } else {
        showToast(nextFiles.length === 1 ? "已追加1张图片" : "已追加" + nextFiles.length + "张图片");
      }
      localImageInput.value = "";
    });
  }
  if (uploadPreviewList) {
    uploadPreviewList.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-upload-index]");
      if (!removeBtn) return;
      const idx = Number(removeBtn.getAttribute("data-remove-upload-index"));
      if (!Number.isFinite(idx)) return;
      const imgs = Array.from(state.create.sourceImages || []);
      if (idx < 0 || idx >= imgs.length) return;
      imgs.splice(idx, 1);
      state.create.sourceImages = imgs;
      state.create.uploaded = imgs.length > 0;
      state.create.sourceImage = imgs[0] || "./images/上衣原图.webp";
      if (!state.create.uploaded) {
        state.create.fileName = "";
      }
      saveState();
      renderCreate();
      showToast("已删除图片");
    });
  }
  function openBrandModal() {
    if (!brandModalMask || !brandModal) return;
    selectedBrandSources = [];
    $$(".brand-item.selected").forEach((el) => el.classList.remove("selected"));
    brandModalMask.classList.add("show");
    brandModal.classList.add("show");
    brandModalMask.setAttribute("aria-hidden", "false");
    brandModal.setAttribute("aria-hidden", "false");
  }
  function closeBrandModal() {
    if (!brandModalMask || !brandModal) return;
    brandModalMask.classList.remove("show");
    brandModal.classList.remove("show");
    brandModalMask.setAttribute("aria-hidden", "true");
    brandModal.setAttribute("aria-hidden", "true");
  }
  if (startGenerateBtn) {
    startGenerateBtn.addEventListener("click", () => {
      if (!state.create.modePicked) {
        showToast("请先选择创作模式");
        return;
      }
      openBrandModal();
    });
  }
  if (brandModalCloseBtn) brandModalCloseBtn.addEventListener("click", closeBrandModal);
  if (brandModalMask) brandModalMask.addEventListener("click", closeBrandModal);
  if (brandModal) {
    brandModal.addEventListener("click", (e) => {
      const item = e.target.closest(".brand-item[data-brand-src]");
      if (!item) return;
      const src = item.getAttribute("data-brand-src") || "./images/上衣原图.webp";
      const idx = selectedBrandSources.indexOf(src);
      if (idx >= 0) {
        selectedBrandSources.splice(idx, 1);
        item.classList.remove("selected");
        return;
      }
      selectedBrandSources.push(src);
      item.classList.add("selected");
    });
  }
  if (brandModalConfirmBtn) {
    brandModalConfirmBtn.addEventListener("click", () => {
      if (!selectedBrandSources.length) {
        showToast("请先选择品牌库图片");
        return;
      }
      const existing = Array.from(state.create.sourceImages || []);
      const remain = Math.max(0, 3 - existing.length);
      if (remain <= 0) {
        showToast("最多上传3张，请先删除后再选择");
        return;
      }
      const picked = selectedBrandSources.slice(0, remain);
      const merged = existing.concat(picked).slice(0, 3);
      state.create.uploaded = true;
      state.create.fileName = "";
      state.create.sourceLabel = "brand";
      state.create.sourceImage = merged[0] || "./images/上衣原图.webp";
      state.create.sourceImages = merged;
      saveState();
      renderCreate();
      closeBrandModal();
      showToast("已从品牌库追加" + picked.length + "张");
    });
  }
  if (resetCreateBtn) {
    resetCreateBtn.addEventListener("click", () => {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      generatedResults = [];
      state.create = {
        ...defaultState.create,
      };
      saveState();
      renderCreate();
      renderGeneratedResults();
      showToast("已清空创作表单");
    });
  }
  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      if (!state.create.modePicked) {
        showToast("请先选择创作模式");
        return;
      }
      if (!state.create.uploaded) {
        showToast("请先上传原图");
        return;
      }
      const sourceImages = (state.create.sourceImages && state.create.sourceImages.length
        ? state.create.sourceImages
        : [state.create.sourceImage || "./images/上衣原图.webp"]
      ).slice(0, 3);
      const resultItems = [];
      Object.entries(mainSubState.types).forEach(([key, item]) => {
        if (!item.checked) return;
        for (let i = 0; i < item.count; i += 1) {
          resultItems.push({
            id: key + "_" + i + "_" + Date.now(),
            typeKey: key,
            typeLabel: typeLabelByKey(key),
            src: sourceImages[(resultItems.length + i) % sourceImages.length],
            progress: Math.floor(Math.random() * 12) + 3,
            status: "generating",
          });
        }
      });
      generatedResults = resultItems;
      renderGeneratedResults();
      startResultProgress();
      showToast("开始创作中");
    });
  }
  if (createResultList) {
    createResultList.addEventListener("click", (e) => {
      const card = e.target.closest(".result-card[data-result-index]");
      if (!card) return;
      const idx = Number(card.getAttribute("data-result-index"));
      const item = generatedResults[idx];
      if (!item) return;
      const actionBtn = e.target.closest("[data-result-action]");
      const action = actionBtn ? actionBtn.getAttribute("data-result-action") : "detail";
      if (item.status === "generating") return;
      if (action === "download") {
        downloadImage(item.src, item.typeLabel + "-" + (idx + 1) + ".jpg");
        return;
      }
      openResultDetail(item);
    });
  }
  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      const doneList = generatedResults.filter((it) => it.status === "done");
      if (!doneList.length) {
        showToast("暂无可导出的图片");
        return;
      }
      doneList.forEach((item, idx) => {
        downloadImage(item.src, item.typeLabel + "-" + (idx + 1) + ".jpg");
      });
      showToast("已导出全部高清原图");
    });
  }
  if (resultDetailCloseBtn) resultDetailCloseBtn.addEventListener("click", closeResultDetail);
  if (resultDetailMask) resultDetailMask.addEventListener("click", closeResultDetail);
  if (resultDetailDownloadBtn) {
    resultDetailDownloadBtn.addEventListener("click", () => {
      if (!activeResultDetail) return;
      downloadImage(activeResultDetail.src, activeResultDetail.typeLabel + "-详情.jpg");
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (!state.create.modePicked) {
        showToast("请先选择创作模式");
        return;
      }
      if (!state.create.uploaded) {
        showToast("请先上传原图");
        return;
      }
      state.messages.unshift({
        id: "m" + Date.now(),
        title: "高清导出完成：" + (state.create.fileName || "未命名文件"),
        time: "刚刚",
        read: false,
      });
      saveState();
      renderMessages();
      showToast("高清导出成功");
    });
  }
  renderGeneratedResults();
  syncPowerUI();

  // Message tab
  const msgList = $("#msgList");
  const markAllReadBtn = $("#markAllReadBtn");
  const clearMsgBtn = $("#clearMsgBtn");

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      state.messages = state.messages.map((m) => ({ ...m, read: true }));
      saveState();
      renderMessages();
      showToast("已全部标记为已读");
    });
  }
  if (msgList) {
    msgList.addEventListener("click", (e) => {
      const item = e.target.closest(".msg-item[data-msg-id]");
      if (!item) return;
      const id = item.getAttribute("data-msg-id");
      const hit = state.messages.find((m) => m.id === id);
      if (!hit) return;
      hit.read = true;
      saveState();
      renderMessages();
      showToast("消息已读");
    });
  }
  if (clearMsgBtn) {
    clearMsgBtn.addEventListener("click", () => {
      state.messages = state.messages.filter((m) => !m.read);
      saveState();
      renderMessages();
      showToast("已清空已读消息");
    });
  }

  // Profile tab
  const editProfileBtn = $("#editProfileBtn");
  const openVipBtn = $("#openVipBtn");
  const logoutBtn = $("#logoutBtn");
  const menuList = $(".menu-list");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      state.user.name = state.user.name === "演示用户" ? "电商创作者" : "演示用户";
      saveState();
      renderProfile();
      showToast("资料已更新");
    });
  }
  if (openVipBtn) {
    openVipBtn.addEventListener("click", () => {
      state.user.vip = !state.user.vip;
      saveState();
      renderProfile();
      showToast(state.user.vip ? "会员开通成功" : "已关闭会员状态");
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(APP_KEY);
      Object.assign(state, cloneDefaultState());
      renderAll();
      setTab("home");
      showToast("已退出并重置本地数据");
    });
  }
  if (menuList) {
    menuList.addEventListener("click", (e) => {
      const item = e.target.closest(".menu-item[data-menu]");
      if (!item) return;
      showToast("打开：" + (item.getAttribute("data-menu") || ""));
    });
  }

  renderAll();
  setTab(state.tab, { keepScroll: true });
})();

