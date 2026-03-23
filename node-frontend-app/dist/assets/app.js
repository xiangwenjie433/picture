(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const APP_KEY = "huiniao_c_app_state_v2";

  const phone = $("#phone");
  if (!phone) return;

  const toastEl = $("#toast");
  let toastTimer = null;

  const seedCases = [
    { id: "c1", title: "服装商拍专区", desc: "平铺拍摄即可生成多角度商业视觉", cat: "fashion", thumb: "t1" },
    { id: "c2", title: "全品类爆款生成", desc: "美妆/家居/3C 细分风格模板", cat: "beauty", thumb: "t2" },
    { id: "c3", title: "动态场景重组", desc: "物理引擎光影重构，质感升级", cat: "home", thumb: "t3" },
    { id: "c4", title: "工业级批量工厂", desc: "百图并行处理，自动裁切下载", cat: "3c", thumb: "t4" },
    { id: "c5", title: "夏季穿搭套图", desc: "同款多姿势裂变，快速上新", cat: "fashion", thumb: "t1" },
    { id: "c6", title: "护肤礼盒主图", desc: "柔光氛围，突出产品层次", cat: "beauty", thumb: "t2" },
    { id: "c7", title: "厨房场景图", desc: "生活方式场景强化转化", cat: "home", thumb: "t3" },
    { id: "c8", title: "3C 详情头图", desc: "参数卖点突出，适配电商平台", cat: "3c", thumb: "t4" },
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
      mode: "电商主图",
      size: "1080 x 1080（通用）",
      prompt: "",
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
        fashion: "服装",
        beauty: "美妆",
        home: "家居",
        "3c": "3C",
      }[key] || "全部"
    );
  }

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
          '">' +
          '<div class="m-thumb ' +
          it.thumb +
          '"></div>' +
          '<div class="m-meta"><h4>' +
          escapeHtml(it.title) +
          '</h4><p>' +
          escapeHtml(it.desc) +
          "</p></div></article>"
      )
      .join("");

    if (filterBtn) filterBtn.textContent = "筛选：" + mapChipLabel(state.activeCaseChip);
    $$(".chip[data-chip]").forEach((chip) => {
      chip.classList.toggle("active", chip.getAttribute("data-chip") === state.activeCaseChip);
    });

    const loadBtn = $("#loadMoreCasesBtn");
    if (loadBtn) {
      loadBtn.style.display = showList.length < list.length ? "block" : "none";
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
    const uploadBox = $("#uploadBox");
    const title = uploadBox ? uploadBox.querySelector(".upload-title") : null;
    const desc = uploadBox ? uploadBox.querySelector(".upload-desc") : null;
    const mode = $("#createMode");
    const size = $("#createSize");
    const prompt = $("#createPrompt");

    if (uploadBox) {
      uploadBox.style.borderStyle = state.create.uploaded ? "solid" : "dashed";
      uploadBox.style.borderColor = state.create.uploaded ? "#c7d2fe" : "#d5dbea";
    }
    if (title) title.textContent = state.create.uploaded ? "已上传：" + state.create.fileName : "上传原图";
    if (desc) desc.textContent = state.create.uploaded ? "原图已就绪，可继续生成预览。" : "支持 JPG / PNG，建议 1200px 以上";
    if (mode) mode.value = state.create.mode;
    if (size) size.value = state.create.size;
    if (prompt) prompt.value = state.create.prompt;
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

  // Case tab
  const caseChips = $("#caseChips");
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
  if (loadMoreCasesBtn) {
    loadMoreCasesBtn.addEventListener("click", () => {
      state.casePage += 1;
      saveState();
      renderCases();
      showToast("加载更多成功");
    });
  }
  const caseMasonry = $("#page-template .masonry");
  if (caseMasonry) {
    caseMasonry.addEventListener("click", (e) => {
      const card = e.target.closest(".m-card[data-case-id]");
      if (!card) return;
      const id = card.getAttribute("data-case-id");
      const hit = state.cases.find((it) => it.id === id);
      if (hit) showToast("案例：" + hit.title);
    });
  }

  // Create tab
  const createMode = $("#createMode");
  const createSize = $("#createSize");
  const createPrompt = $("#createPrompt");
  const mockUploadBtn = $("#mockUploadBtn");
  const resetCreateBtn = $("#resetCreateBtn");
  const previewBtn = $("#previewBtn");
  const exportBtn = $("#exportBtn");

  if (createMode) {
    createMode.addEventListener("change", () => {
      state.create.mode = createMode.value;
      saveState();
    });
  }
  if (createSize) {
    createSize.addEventListener("change", () => {
      state.create.size = createSize.value;
      saveState();
    });
  }
  if (createPrompt) {
    createPrompt.addEventListener("input", () => {
      state.create.prompt = createPrompt.value;
      saveState();
    });
  }
  if (mockUploadBtn) {
    mockUploadBtn.addEventListener("click", () => {
      state.create.uploaded = true;
      state.create.fileName = "demo-product-" + Math.floor(Math.random() * 90 + 10) + ".jpg";
      saveState();
      renderCreate();
      showToast("图片上传成功");
    });
  }
  if (resetCreateBtn) {
    resetCreateBtn.addEventListener("click", () => {
      state.create = {
        ...defaultState.create,
      };
      saveState();
      renderCreate();
      showToast("已清空创作表单");
    });
  }
  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      if (!state.create.uploaded) {
        showToast("请先上传原图");
        return;
      }
      state.messages.unshift({
        id: "m" + Date.now(),
        title: "预览生成成功：" + state.create.mode + " / " + state.create.size,
        time: "刚刚",
        read: false,
      });
      saveState();
      renderMessages();
      showToast("预览生成成功");
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
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

