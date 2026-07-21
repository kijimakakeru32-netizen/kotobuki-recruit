/* =====================================================================
   整体KOTOBUKI 採用サイト main.js
   ※このファイルはサイトの表示を組み立てるプログラムです。
     文章・画像・リンクの変更は js/config.js で行ってください。
   ===================================================================== */
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const nl = (s) => esc(s).replace(/\n/g, "<br>");
  /* **文字** を太字に変換（config.jsの文章ブロック用） */
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

  /* 画像 or プレースホルダー */
  function imgBox(src, label, cls) {
    if (src) {
      return `<div class="imgbox ${cls || ""}"><img src="${esc(src)}" alt="${esc(label || "")}" loading="lazy"></div>`;
    }
    return `<div class="imgbox ${cls || ""}"><div class="ph">${esc(label || "PHOTO")}</div></div>`;
  }

  const LINE_ICON = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5C6.2 2.5 1.5 6.4 1.5 11.2c0 4.3 3.8 7.9 8.9 8.6.35.07.82.23.94.53.11.27.07.69.04.96l-.15.92c-.05.27-.22 1.07.94.58 1.16-.48 6.24-3.67 8.51-6.29C22.3 14.7 22.5 13 22.5 11.2c0-4.8-4.7-8.7-10.5-8.7Z"/></svg>`;

  function lineBtn(text, extraCls, shortText) {
    const label = shortText
      ? `<span class="t-long">${esc(text)}</span><span class="t-short">${esc(shortText)}</span>`
      : `<span>${esc(text)}</span>`;
    return `<a class="btn-line ${extraCls || ""}" href="${esc(S.line.url)}" target="_blank" rel="noopener">${LINE_ICON}${label}</a>`;
  }

  function secHead(h, outline) {
    return `<div class="sec-head rv">
      <div class="en ${outline ? "outline" : ""}">${esc(h.en)}</div>
      <div class="ja">${esc(h.ja)}</div>
    </div>`;
  }

  /* ============ 共通:ヘッダー・メニュー・フッター・追従CTA ============ */
  function logoHTML(inFooter) {
    const src = inFooter ? (S.brand.logoImgWhite || S.brand.logoImg) : S.brand.logoImg;
    if (src) {
      return `<a class="logo" href="index.html"><img src="${esc(src)}" alt="${esc(S.brand.nameJa)} ${esc(S.brand.nameSub)}"></a>`;
    }
    return `<a class="logo" href="index.html">
      <span class="l-top">RECRUIT SITE</span>
      <span class="l-main">KOTOBUKI<small>整体 ${esc(S.brand.nameSub)}</small></span>
    </a>`;
  }

  function renderChrome() {
    // ヘッダー
    const header = document.createElement("header");
    header.id = "header";
    header.innerHTML = `
      ${logoHTML()}
      <nav class="gnav" aria-label="グローバルナビゲーション">
        ${S.nav.map(n => `<a class="nav-item" href="${esc(n.href)}"><span class="n-ja">${esc(n.text)}</span><span class="n-en">${esc(n.en)}</span></a>`).join("")}
        ${lineBtn(S.line.buttonText, "", S.line.shortText || "")}
        <button id="menu-btn" aria-label="メニューを開く" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>`;
    document.body.prepend(header);

    // スマホ全画面メニュー
    const mm = document.createElement("nav");
    mm.id = "mobile-menu";
    mm.setAttribute("aria-label", "メニュー");
    let d = 0;
    const delay = () => `style="transition-delay:${(0.06 * d++ + 0.1).toFixed(2)}s"`;
    const groups = S.nav.map(n => `
      <div class="m-group">
        <a class="m-item" ${delay()} href="${esc(n.href)}"><span class="n-en">${esc(n.en)}</span><span class="n-ja">${esc(n.text)}</span></a>
        ${(n.children || []).map(c => `<a class="m-sub" ${delay()} href="${esc(c.href)}">${esc(c.text)}</a>`).join("")}
      </div>`).join("");
    mm.innerHTML = `
      <button id="menu-close" aria-label="メニューを閉じる"><span class="x"><i></i><i></i></span><span class="cl">CLOSE</span></button>
      ${S.brand.logoImgWhite ? `<div class="m-logo"><img src="${esc(S.brand.logoImgWhite)}" alt="${esc(S.brand.nameJa)} ${esc(S.brand.nameSub)}"></div>` : ""}
      ${groups}
      <div class="m-group">
        <a class="m-item" ${delay()} href="index.html#cta"><span class="n-en">CONTACT</span><span class="n-ja">お問い合わせ</span></a>
      </div>
      <div class="m-cta">${lineBtn(S.line.buttonText)}</div>`;
    document.body.appendChild(mm);

    const btn = $("#menu-btn");
    const closeMenu = () => {
      mm.classList.remove("is-open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    };
    btn.addEventListener("click", () => {
      const open = mm.classList.toggle("is-open");
      btn.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $("#menu-close", mm).addEventListener("click", closeMenu);
    mm.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });

    // フッター
    const footer = document.createElement("footer");
    footer.id = "footer";
    footer.innerHTML = `
      <div class="wrap f-grid">
        <div class="f-brand">
          ${logoHTML(true)}
        </div>
        <nav class="f-links" aria-label="フッターナビゲーション">
          ${S.footer.links.map(l => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join("")}
          <div class="f-official"><a href="${esc(S.footer.officialSite.href)}" target="_blank" rel="noopener">${esc(S.footer.officialSite.text)} ↗</a></div>
        </nav>
      </div>
      <div class="copyright">${esc(S.brand.copyright)}</div>`;
    document.body.appendChild(footer);

    // スマホ追従CTA
    const sticky = document.createElement("div");
    sticky.id = "sticky-cta";
    sticky.innerHTML = lineBtn(S.line.stickyText);
    document.body.appendChild(sticky);

    // ページトップ
    const totop = document.createElement("button");
    totop.id = "totop"; totop.textContent = "TOP";
    totop.setAttribute("aria-label", "ページ上部へ戻る");
    totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(totop);

    // スクロールで出す
    const onScroll = () => {
      const y = window.scrollY;
      const isIndex = document.body.dataset.page === "index";
      const threshold = isIndex ? window.innerHeight * 0.55 : 160;
      sticky.classList.toggle("is-show", y > threshold);
      totop.classList.toggle("is-show", y > 600);
      // トップページ最上部ではヘッダーを透明化（FVの写真を見せる）
      header.classList.toggle("is-clear", isIndex && y < 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============ スプラッシュ ============ */
  function splash() {
    const isIndex = document.body.dataset.page === "index";
    let seen = false;
    try { seen = sessionStorage.getItem("kbk-splash") === "1"; } catch (e) {}
    if (!isIndex || seen) { document.body.classList.add("no-splash"); revealHeader(200); return; }
    const el = document.createElement("div");
    el.id = "splash";
    const word = "KOTOBUKI";
    el.innerHTML = `
      <div class="sp-en">${word.split("").map((c, i) => `<span style="animation-delay:${0.05 * i + 0.15}s">${c}</span>`).join("")}</div>
      <div class="sp-bar"></div>
      <div class="sp-ja">整体KOTOBUKI 採用サイト</div>`;
    document.body.prepend(el);
    try { sessionStorage.setItem("kbk-splash", "1"); } catch (e) {}
    setTimeout(() => {
      el.classList.add("is-done");
      revealHeader(500);
      setTimeout(() => el.remove(), 1200);
    }, 2100);
  }
  function revealHeader(delay) {
    setTimeout(() => {
      $("#header").classList.add("is-show");
      const hero = $("#hero");
      if (hero) hero.classList.add("is-ready");
    }, delay);
  }

  /* ============ トップ:ファーストビュー ============ */
  function renderHero() {
    const el = $("#hero"); if (!el) return;
    // 写真が入っているスロットだけを採用。1枚しか無い場合は
    // 同じ写真を3通りのカメラワーク(ズーム/パン)で切り替えてリッチに見せる
    const real = S.hero.images.filter(im => im.img);
    let slides;
    if (real.length === 0) {
      slides = S.hero.images.map(im => ({ ...im, kb: "kb-a" }));
    } else if (real.length === 1) {
      slides = ["kb-a", "kb-b", "kb-c"].map(kb => ({ ...real[0], kb }));
    } else {
      const kbs = ["kb-a", "kb-b", "kb-c"];
      slides = real.map((im, i) => ({ ...im, kb: kbs[i % 3] }));
    }
    el.innerHTML = `
      <div class="hero-slides">
        ${slides.map((im, i) => `<div class="hero-slide ${im.kb} ${i === 0 ? "is-active" : ""}">${imgBox(im.img, im.label)}</div>`).join("")}
      </div>
      <div class="hero-msg">
        ${S.hero.copyLines.map(l => `<div class="hero-copy-row"><h1 class="hero-copy">${esc(l)}</h1></div>`).join("")}
        <p class="hero-sub">${nl(S.hero.sub)}</p>
        ${S.hero.enTagline ? `<p class="hero-en">${esc(S.hero.enTagline)}</p>` : ""}
      </div>`;
    // 見出しタグの整理: 2行目以降はspan扱いに
    el.querySelectorAll(".hero-copy-row").forEach((r, i) => {
      if (i > 0) { const h = r.querySelector("h1"); const s = document.createElement("p"); s.className = "hero-copy"; s.innerHTML = h.innerHTML; h.replaceWith(s); }
    });
    const slideEls = el.querySelectorAll(".hero-slide");
    if (slideEls.length > 1) {
      let cur = 0;
      setInterval(() => {
        slideEls[cur].classList.remove("is-active");
        cur = (cur + 1) % slideEls.length;
        const img = slideEls[cur].querySelector("img");
        if (img) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
        slideEls[cur].classList.add("is-active");
      }, 3500);
    }
  }

  /* ============ トップ:画像スライダー ============ */
  function renderGallery() {
    const el = $("#gallery"); if (!el) return;
    const items = S.slider.map(im => `<div class="marquee-item">${imgBox(im.img, im.label)}</div>`).join("");
    el.innerHTML = `
      <div class="marquee" aria-hidden="true">${items}${items}</div>`;
  }

  /* ============ トップ:ムービー（YouTube埋め込み） ============ */
  function renderMovie() {
    const el = $("#movie"); if (!el || !S.movie) return;
    const m = S.movie;
    const idMatch = String(m.youtube || "").match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/);
    const vid = idMatch ? idMatch[1] : String(m.youtube || "").trim();
    if (!vid) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(m.heading)}
      <p class="sec-lead movie-lead rv">${nl(m.lead)}</p>
      <div class="movie-frame rv" id="movie-frame" data-vid="${esc(vid)}"></div>
      <p class="movie-text rv">${nl(m.text)}</p>
    </div>`;
    // 画面に近づいたら読み込み、ミュート自動再生（ブラウザ仕様上、自動再生はミュート必須）
    const frame = $("#movie-frame");
    const load = () => {
      if (frame.dataset.loaded) return;
      frame.dataset.loaded = "1";
      frame.innerHTML = `<iframe
        src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid)}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(vid)}&rel=0&playsinline=1"
        title="${esc(m.lead)}"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowfullscreen loading="lazy"></iframe>`;
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) { load(); io.disconnect(); } });
      }, { rootMargin: "200px 0px" });
      io.observe(frame);
    } else { load(); }
  }

  /* ============ トップ:ABOUT ============ */
  function renderAbout() {
    const el = $("#about"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.about.heading)}
      <div class="about-cards">
        ${S.about.cards.map((c, i) => `
          <a class="about-card rv rv-d${i}" href="${esc(c.link)}">
            <span class="imgwrap">${imgBox(c.img, c.title)}</span>
            <div class="txt"><h3>${esc(c.title)}<span class="go" aria-hidden="true">→</span></h3><p>${esc(c.text)}</p></div>
          </a>`).join("")}
      </div>
    </div>`;
  }

  /* ============ トップ:店舗マップ ============ */
  function renderMap() {
    const el = $("#map"); if (!el) return;
    const MD = window.MAP_DATA || null;
    let svg = "";
    if (MD) {
      const actives = Object.keys(MD.activePaths || {}).map(k =>
        `<path class="land is-active pref-${k}" d="${MD.activePaths[k]}"/>`).join("");
      const pins = S.map.prefectures.map(p => {
        const pos = MD.pins[p.key], lb = MD.labels[p.key];
        if (!pos || !lb) return "";
        const cnt = p.key === "chubu" ? "NEW" : p.stores.length + "院";
        return `
          <g class="pin pref-${p.key}">
            <line x1="${pos.x}" y1="${pos.y}" x2="${lb.lx}" y2="${lb.ly}"/>
            <circle class="pin-ring" cx="${pos.x}" cy="${pos.y}" r="8"/>
            <circle class="pin-dot" cx="${pos.x}" cy="${pos.y}" r="4"/>
            <text class="pin-label" x="${lb.lx}" y="${lb.ly - 3}" text-anchor="middle">${esc(p.name)}</text>
            <text class="pin-count" x="${lb.lx}" y="${lb.ly + 11}" text-anchor="middle">${cnt}</text>
          </g>`;
      }).join("");
      svg = `
      <svg class="japan-map" viewBox="0 0 600 560" role="img" aria-label="店舗展開マップ：${esc(S.map.lead)}">
        <path class="land" d="${MD.landPath}"/>
        ${actives}
        ${pins}
      </svg>`;
    }

    const gmap = (st) =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("整体KOTOBUKI " + st.name + " " + st.address)}`;
    const PIN_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>`;
    const list = S.map.prefectures.map((p, i) => `
      <details class="store-pref pref-${p.key} rv">
        <summary>${esc(p.name)}<span class="cnt">${p.key === "chubu" ? "NEW" : p.stores.length + "院"}</span></summary>
        <ul>${p.stores.map(st => `
          <li>
            <b>${p.key === "chubu" ? "" : "整体KOTOBUKI -寿- "}${esc(st.name)}</b>
            <span>${esc(st.address)}</span>
            ${p.key === "chubu" ? "" : `<a class="gmap-btn" href="${gmap(st)}" target="_blank" rel="noopener">${PIN_ICON}Google Mapで見る</a>`}
          </li>`).join("")}</ul>
      </details>`).join("");

    const m = S.map.lead.match(/^(.*?)(\d+)(.*)$/);
    const leadHTML = m
      ? `${esc(m[1])}<span class="num" data-count="${m[2]}">0</span>${esc(m[3])}`
      : esc(S.map.lead);
    el.innerHTML = `<div class="wrap">
      ${secHead(S.map.heading, true)}
      <p class="map-count rv">${leadHTML}</p>
      ${S.map.note ? `<p class="map-note rv">${esc(S.map.note)}</p>` : ""}
      <p class="sec-sub rv">${esc(S.map.sub)}</p>
      <div class="map-grid">
        <div class="rv">${svg}</div>
        <div class="store-list">${list}</div>
      </div>
    </div>`;
  }

  /* ============ トップ:働く環境（制度・カルチャー入口カード） ============ */
  function renderEnv() {
    const el = $("#environment"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.environment.heading)}
      <p class="sec-lead rv">${esc(S.environment.lead)}</p>
      <p class="sec-sub rv">${esc(S.environment.sub)}</p>
      <div class="about-cards" style="margin-top:clamp(30px,4vw,50px)">
        ${S.environment.cards.map((c, i) => `
          <a class="about-card rv rv-d${i}" href="${esc(c.link)}">
            <span class="imgwrap">${imgBox(c.img, c.title)}</span>
            <div class="txt"><h3>${esc(c.title)}<span class="go" aria-hidden="true">→</span></h3><p>${esc(c.text)}</p></div>
          </a>`).join("")}
      </div>
    </div>`;
  }

  /* ============ トップ:キャリアステップ（階段インフォグラフィック） ============ */
  const CAREER_ICONS = [
    // 研修: 開いた本
    `<svg viewBox="0 0 24 24"><path d="M12 6c-2-1.6-5-1.6-8-.4v13c3-1.2 6-1.2 8 .4 2-1.6 5-1.6 8-.4V5.6c-3-1.2-6-1.2-8 .4Z"/><path d="M12 6v13.6"/></svg>`,
    // スタッフ: 人物
    `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c1.2-3.8 3.8-5.6 7-5.6s5.8 1.8 7 5.6"/></svg>`,
    // 役職者: 星バッジ
    `<svg viewBox="0 0 24 24"><path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z"/></svg>`,
    // オーナー: 山頂の旗
    `<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M6.5 21l5-9 3 4.5 3-5.5 3 10"/><path d="M11.5 12V4.5"/><path d="M11.5 4.5h5l-1.6 2 1.6 2h-5"/></svg>`
  ];
  const CAREER_CLIMBER = `
    <svg class="cg-person" viewBox="0 0 60 74" aria-hidden="true">
      <circle cx="26" cy="12" r="7" fill="#fff"/>
      <path d="M26 20c-6 0-9 5-9 11v9h5l1.5 14h5L30 40h5v-9c0-6-3-11-9-11Z" fill="#fff"/>
      <path d="M33 26l9-7" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M44 4v18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M44 4h13l-4.5 4.5L57 13H44Z" fill="var(--blue-fresh-1)"/>
    </svg>`;
  /* スマホ: 人物がSTEP1→4へジャンプしながら自動スクロールするツアー */
  function startCareerTour(el) {
    if (!(window.matchMedia && matchMedia("(max-width:820px)").matches)) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const g = el.querySelector(".career-graph");
    const hopper = el.querySelector(".cg-hopper");
    const bars = [...el.querySelectorAll(".cg-bar")];
    if (!g || !hopper || bars.length < 2) return;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const posOf = (i) => {
      const rb = bars[i].getBoundingClientRect();
      const rg = g.getBoundingClientRect();
      return {
        x: rb.left - rg.left + g.scrollLeft + rb.width / 2 - hopper.getBoundingClientRect().width / 2,
        y: rb.top - rg.top + g.scrollTop - hopper.getBoundingClientRect().height + 4
      };
    };
    const setPos = (p) => { hopper.style.transform = `translate(${p.x}px,${p.y}px)`; };
    let started = false;
    const run = async () => {
      if (started) return; started = true;
      await sleep(reduce ? 0 : 1300); // バーが伸び切るのを待つ
      let cur = posOf(0);
      setPos(cur);
      hopper.classList.add("is-on");
      if (reduce) { // 動きを減らす設定: 最終位置へ直行
        g.scrollLeft = g.scrollWidth; setPos(posOf(bars.length - 1));
        hopper.classList.add("is-goal"); return;
      }
      await sleep(700);
      for (let i = 1; i < bars.length; i++) {
        const rb = bars[i].getBoundingClientRect(), rg = g.getBoundingClientRect();
        g.scrollTo({ left: Math.max(0, rb.left - rg.left + g.scrollLeft - 90), behavior: "smooth" });
        await sleep(320);
        const next = posOf(i);
        const midX = (cur.x + next.x) / 2;
        const midY = Math.min(cur.y, next.y) - 46;
        hopper.animate([
          { transform: `translate(${cur.x}px,${cur.y}px)` },
          { transform: `translate(${midX}px,${midY}px)`, offset: .5 },
          { transform: `translate(${next.x}px,${next.y}px)` }
        ], { duration: 680, easing: "ease-in-out" });
        await sleep(680);
        setPos(next); cur = next;
        await sleep(360);
      }
      hopper.classList.add("is-goal");
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.35 });
      io.observe(g);
    } else { run(); }
    window.addEventListener("resize", () => {
      // ツアー完了後にリサイズされたら最終ステップ上に置き直す
      if (hopper.classList.contains("is-goal")) setPos(posOf(bars.length - 1));
    });
  }

  function renderCareer() {
    const el = $("#career"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.career.heading, true)}
      <p class="sec-lead rv">${esc(S.career.lead)}</p>
      <p class="sec-sub rv">${esc(S.career.sub)}</p>
      <div class="career-wrap rv">
        <svg class="cg-trend" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="cg-trend-line" d="M2 88 L30 66 L56 44 L84 16" pathLength="100"/>
        </svg>
        <svg class="cg-trend-head" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" fill="none"/></svg>
        <div class="career-graph" role="list">
          ${S.career.steps.map((st, i) => `
            <div class="cg-item rv rv-d${i}" role="listitem" style="--lv:${i + 1}">
              <div class="cg-card">
                <div class="cg-icon">${CAREER_ICONS[i] || CAREER_ICONS[0]}</div>
                <div class="cg-no">0${i + 1}</div>
                <h3>${esc(st.title)}</h3>
                ${st.text ? `<p>${esc(st.text)}</p>` : ""}
                ${(st.tags && st.tags.length) ? `<div class="cg-tags">${st.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
              </div>
              <div class="cg-bar">
                ${i === S.career.steps.length - 1 ? CAREER_CLIMBER : ""}
                <span>${esc(st.step)}</span>
              </div>
            </div>`).join("")}
        </div>
        <p class="career-swipe-hint" aria-hidden="true">SWIPE →</p>
      </div>
    </div>`;
    // スマホ用: ステップを跳び移る人物（自動ツアー）
    const graph = el.querySelector(".career-graph");
    graph.insertAdjacentHTML("beforeend", CAREER_CLIMBER.replace("cg-person", "cg-hopper"));
    startCareerTour(el);
    // カード高を最大値に統一し、階段の段差がバーの高さ差だけで決まるようにする
    const equalize = () => {
      const cards = [...el.querySelectorAll(".cg-card")];
      cards.forEach(c => { c.style.height = "auto"; });
      const max = Math.max(...cards.map(c => c.offsetHeight));
      cards.forEach(c => { c.style.height = max + "px"; });
    };
    requestAnimationFrame(equalize);
    window.addEventListener("load", equalize);
    let cgT;
    window.addEventListener("resize", () => { clearTimeout(cgT); cgT = setTimeout(equalize, 150); });
  }

  /* ============ トップ:研修制度（入口カード） ============ */
  function renderTraining() {
    const el = $("#training"); if (!el) return;
    const c = S.training.card;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.training.heading)}
      <p class="sec-lead rv">${esc(S.training.lead)}</p>
      <p class="sec-sub rv">${esc(S.training.sub)}</p>
      <div class="about-cards about-cards--single" style="margin-top:clamp(30px,4vw,50px)">
        <a class="about-card rv" href="${esc(c.link)}">
          <span class="imgwrap">${imgBox(c.img, c.title)}</span>
          <div class="txt"><h3>${esc(c.title)}<span class="go" aria-hidden="true">→</span></h3><p>${esc(c.text)}</p></div>
        </a>
      </div>
    </div>`;
  }

  /* ============ インタビューカード(共通部品) ============ */
  function ivCard(p, i) {
    return `
      <a class="iv-card rv rv-d${i % 3}" href="${esc(p.page)}">
        ${imgBox(p.photo, p.photoLabel)}
        <div class="txt">
          <span class="job">${esc(p.job)}</span>
          <h3>${esc(p.title)}</h3>
          <div class="name"><b>${esc(p.name)}</b></div>
          <div class="more">READ MORE</div>
        </div>
      </a>`;
  }

  function renderInterviewTop() {
    const el = $("#interview"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.interview.heading)}
      <p class="sec-lead rv">${esc(S.interview.lead)}</p>
      <p class="sec-sub rv">${esc(S.interview.sub)}</p>
      <div class="iv-cards" style="margin-top:clamp(30px,4vw,50px)">
        ${S.interview.people.map((p, i) => ivCard(p, i)).join("")}
      </div>
      <div class="env-spacer"></div>
    </div>`;
  }

  /* ============ トップ:CTA ============ */
  function ctaInner() {
    return `
      <div class="cta-bg" aria-hidden="true">LINE US</div>
      <div class="wrap">
        ${secHead(S.cta.heading)}
        <div class="cta-lines rv">
          ${S.cta.lines.map(l => `<p>${esc(l)}</p>`).join("")}
        </div>
        <div class="rv rv-d1">${lineBtn(S.line.buttonText)}</div>
      </div>`;
  }
  function renderCTA() {
    ["#cta", "#cta-bottom"].forEach(sel => {
      const el = $(sel); if (el) el.innerHTML = ctaInner();
    });
  }

  /* ============ トップ:入社までの流れ ============ */
  function renderFlow() {
    const el = $("#flow"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.flow.heading, true)}
      <p class="sec-sub rv">${esc(S.flow.sub)}</p>
      <ol class="flow-list" style="margin-top:clamp(30px,4vw,48px)">
        ${S.flow.steps.map(st => `
          <li class="flow-item rv"><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></li>`).join("")}
      </ol>
    </div>`;
  }

  /* ============ トップ:募集要項 ============ */
  function renderReq() {
    const el = $("#requirements"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      ${secHead(S.requirements.heading)}
      <dl class="req-table rv">
        ${S.requirements.rows.map(r => `
          <div class="req-row"><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join("")}
      </dl>
    </div>`;
  }

  /* ============ 下層:インタビュー個別ページ ============ */
  function renderInterviewPage() {
    const root = $("#iv-page"); if (!root) return;
    const id = document.body.dataset.person;
    const idx = S.interview.people.findIndex(p => p.id === id);
    if (idx < 0) return;
    const p = S.interview.people[idx];
    document.title = `${p.name}｜先輩インタビュー｜${S.brand.nameJa} 採用サイト`;
    const others = S.interview.people.filter(o => o.id !== id);
    root.innerHTML = `
      <div class="iv-hero">
        <div class="wrap">
          <div class="pad">
            <div class="crumb" style="font-size:11.5px;color:rgba(255,255,255,.6);margin-bottom:22px"><a href="index.html">TOP</a> ＞ <a href="index.html#interview">先輩インタビュー</a> ＞ ${esc(p.name)}</div>
            <span class="job">${esc(p.job)}</span>
            <h1>${esc(p.title)}</h1>
            <p class="name"><b>${esc(p.name)}</b>整体KOTOBUKI</p>
          </div>
          <div class="iv-photo">${imgBox(p.photo, p.photoLabel)}</div>
        </div>
      </div>
      <div class="iv-qa">
        <div class="wrap">
          ${(p.questions || S.interview.questions).map((q, i) => `
            <div class="qa rv">
              <div class="q"><span class="q-no">Q${i + 1}</span><h2>${esc(q)}</h2></div>
              <p class="a">${nl(p.answers[i] || "")}</p>
              ${qaPhoto(p.photos && p.photos[i])}
            </div>`).join("")}
        </div>
      </div>
      <div class="iv-next">
        <div class="wrap">
          <h2 class="rv">NEXT INTERVIEW</h2>
          <p class="cap rv">次の先輩インタビューを見る</p>
          <div class="iv-cards">${others.map((o, i) => ivCard(o, i)).join("")}</div>
        </div>
      </div>
      <section class="sec sec--navy cta-sec" id="cta" style="text-align:center">
        <div class="cta-bg" aria-hidden="true">LINE US</div>
        <div class="wrap">
          ${secHead(S.cta.heading)}
          <div class="cta-lines rv">
            ${S.cta.lines.map(l => `<p>${esc(l)}</p>`).join("")}
          </div>
          <div class="rv rv-d1">${lineBtn(S.line.buttonText)}</div>
        </div>
      </section>`;
  }

  /* ============ 下層:創業ストーリー ============ */
  function renderStory() {
    const root = $("#story-page"); if (!root) return;
    const st = S.story;
    document.title = `創業ストーリー｜${S.brand.nameJa} 採用サイト`;
    root.innerHTML = `
      <div class="sub-hero">
        <div class="bg-en" aria-hidden="true">${esc(st.heading.en)}</div>
        <div class="wrap">
          <div class="crumb"><a href="index.html">TOP</a> ＞ 創業ストーリー</div>
          ${secHead(st.heading)}
        </div>
      </div>
      <section class="sec">
        <div class="wrap">
          <p class="story-lead rv">${esc(st.lead)}</p>
          ${st.intro ? `<p class="sec-sub rv">${nl(st.intro)}</p>` : ""}
          <div class="story-main-img rv">${imgBox(st.mainImg, "メインビジュアル（後日差し替え）")}</div>
          <div class="story-chapters">
            ${st.chapters.map(c => `
              <div class="story-ch rv">
                <div class="year">${esc(c.no || c.year || "")}</div>
                <h2>${esc(c.title)}</h2>
                <div class="grid">
                  <p>${fmt(c.text)}</p>
                  ${imgBox(c.img, "章の写真（後日差し替え）")}
                </div>
              </div>`).join("")}
          </div>
        </div>
      </section>
      <section class="sec sec--navy cta-sec" id="cta" style="text-align:center">
        <div class="cta-bg" aria-hidden="true">LINE US</div>
        <div class="wrap">
          ${secHead(S.cta.heading)}
          <div class="cta-lines rv">
            ${S.cta.lines.map(l => `<p>${esc(l)}</p>`).join("")}
          </div>
          <div class="rv rv-d1">${lineBtn(S.line.buttonText)}</div>
        </div>
      </section>`;
  }

  /* インタビュー本文中の写真ブロック（img=1枚 / imgs=複数枚を縦に並べる） */
  function qaPhoto(ph) {
    if (!ph) return "";
    const list = (ph.imgs && ph.imgs.length ? ph.imgs : [ph.img]).filter(Boolean);
    if (!list.length) return "";
    return `<figure class="qa-photo">
      ${list.map(src => imgBox(src, ph.caption || "写真")).join("")}
      ${ph.caption ? `<figcaption>${nl(ph.caption)}</figcaption>` : ""}
    </figure>`;
  }

  /* 制度の線画アイコン（benefits.itemsのicon番号に対応） */
  const ENV_ICONS = [
    // 0: カレンダー
    `<svg viewBox="0 0 24 24"><rect x="3.2" y="5" width="17.6" height="15.4" rx="1.6"/><path d="M3.2 9.6h17.6M7.8 3.2v3.4M16.2 3.2v3.4"/><path d="M8.4 13.6h2.2M13.4 13.6h2.2M8.4 17h2.2"/></svg>`,
    // 1: 盾＋チェック
    `<svg viewBox="0 0 24 24"><path d="M12 3l7 2.6v6c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4v-6Z"/><path d="M8.8 12.1l2.2 2.2 4.2-4.4"/></svg>`,
    // 2: 右肩上がりグラフ
    `<svg viewBox="0 0 24 24"><path d="M3.4 20.2h17.2"/><path d="M6 16.4l4.2-4.4 3.2 2.8 5.4-6.6"/><path d="M14.6 8.2h4.2v4.2"/></svg>`,
    // 3: 贈り物の箱
    `<svg viewBox="0 0 24 24"><rect x="3.4" y="9.4" width="17.2" height="11" rx="1.2"/><path d="M2.6 9.4h18.8M12 9.4v11"/><path d="M12 9.4c-2.6 0-4.6-1-4.6-3S9.6 3.2 12 9.4Zm0 0c2.6 0 4.6-1 4.6-3S14.4 3.2 12 9.4Z"/></svg>`,
    // 4: 3人のチーム
    `<svg viewBox="0 0 24 24"><circle cx="12" cy="7.4" r="2.8"/><path d="M7.4 15.6c1-2.2 2.7-3.2 4.6-3.2s3.6 1 4.6 3.2"/><circle cx="4.8" cy="11.4" r="2.1"/><path d="M1.6 18.4c.7-1.8 1.9-2.6 3.2-2.6"/><circle cx="19.2" cy="11.4" r="2.1"/><path d="M22.4 18.4c-.7-1.8-1.9-2.6-3.2-2.6"/></svg>`,
    // 5: ヤシの木と太陽
    `<svg viewBox="0 0 24 24"><circle cx="17.6" cy="6.4" r="2.6"/><path d="M2.6 20.6h18.8"/><path d="M8.6 20.6c-.4-4.4.2-7.6 1.4-9.8"/><path d="M10 10.8c-2-1.4-4.2-1.2-5.8.4M10 10.8c-.6-2.3.3-4.2 2.2-5.2M10 10.8c2.3-.9 4.3-.2 5.4 1.6"/></svg>`
  ];

  /* 研修制度ページの特長アイコン */
  const TRAIN_ICONS = {
    book: `<svg viewBox="0 0 24 24"><path d="M12 6c-2-1.6-5-1.6-8-.4v13c3-1.2 6-1.2 8 .4 2-1.6 5-1.6 8-.4V5.6c-3-1.2-6-1.2-8 .4Z"/><path d="M12 6v13.6"/></svg>`,
    brain: `<svg viewBox="0 0 24 24"><path d="M12 5.5c-1.6-2-5.4-1.6-5.4 1.4-2 .4-2.4 3.4-.6 4.4-1 1.8.4 4 2.4 3.8.2 1.8 2 2.6 3.6 1.8V5.5Z"/><path d="M12 5.5c1.6-2 5.4-1.6 5.4 1.4 2 .4 2.4 3.4.6 4.4 1 1.8-.4 4-2.4 3.8-.2 1.8-2 2.6-3.6 1.8"/></svg>`,
    shield: `<svg viewBox="0 0 24 24"><path d="M12 3l7 2.6v6c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4v-6Z"/><path d="M8.8 12.1l2.2 2.2 4.2-4.4"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z"/></svg>`
  };

  /* 下層ページ共通CTA */
  function subCta() {
    return `
      <section class="sec sec--navy cta-sec" id="cta" style="text-align:center">
        <div class="cta-bg" aria-hidden="true">LINE US</div>
        <div class="wrap">
          ${secHead(S.cta.heading)}
          <div class="cta-lines rv">
            ${S.cta.lines.map(l => `<p>${esc(l)}</p>`).join("")}
          </div>
          <div class="rv rv-d1">${lineBtn(S.line.buttonText)}</div>
        </div>
      </section>`;
  }

  /* ============ 下層:制度 ============ */
  function renderBenefits() {
    const root = $("#benefits-page"); if (!root) return;
    const b = S.benefits;
    document.title = `制度｜${S.brand.nameJa} 採用サイト`;
    root.innerHTML = `
      <div class="sub-hero">
        <div class="wrap">
          <p class="bc rv">TOP &gt; 働く環境 &gt; 制度</p>
          ${secHead(b.heading)}
        </div>
      </div>
      <section class="sec">
        <div class="wrap">
          <p class="story-lead rv">${esc(b.lead)}</p>
          <div class="benefit-intro rv">${fmt(b.intro)}</div>
          <div class="story-main-img rv">${imgBox(b.mainImg, "会社の雰囲気が伝わる写真（後日差し替え）")}</div>
          <div class="env-list" style="margin-top:clamp(40px,6vw,64px)">
            ${b.items.map((it, i) => `
              <div class="env-item rv rv-d${i % 3}">
                <div class="env-icon">${ENV_ICONS[it.icon] || ENV_ICONS[0]}</div>
                <div class="env-no">0${i + 1}</div>
                <h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
              </div>`).join("")}
          </div>
          <div class="env-spacer"></div>
        </div>
      </section>
      ${subCta()}`;
  }

  /* ============ 下層:カルチャー ============ */
  function renderCulture() {
    const root = $("#culture-page"); if (!root) return;
    const c = S.culture;
    document.title = `カルチャー｜${S.brand.nameJa} 採用サイト`;
    root.innerHTML = `
      <div class="sub-hero">
        <div class="wrap">
          <p class="bc rv">TOP &gt; 働く環境 &gt; カルチャー</p>
          ${secHead(c.heading)}
        </div>
      </div>
      <section class="sec cul-intro">
        <div class="wrap">
          <div class="cul-intro-grid">
            <div class="cul-intro-txt">
              <span class="cul-intro-en rv">OUR CULTURE</span>
              <h2 class="cul-intro-lead rv">${nl(c.lead)}</h2>
              ${c.intro ? `<div class="cul-intro-body rv">${fmt(c.intro)}</div>` : ""}
            </div>
            <div class="cul-intro-media rv">
              ${imgBox(c.introImg, "カルチャーのメインビジュアル")}
            </div>
          </div>
        </div>
      </section>
      <section class="sec cul-sec">
        <div class="wrap">
          <div class="cul-list">
            ${c.items.map((it, i) => `
              <div class="cul-item rv ${i % 2 ? "is-rev" : ""}">
                <div class="cul-img">${imgBox(it.img, it.title + "の写真（後日差し替え）")}</div>
                <div class="cul-txt">
                  <div class="cul-no">CULTURE</div>
                  <h2>${esc(it.title)}</h2>
                  <p>${fmt(it.text)}</p>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </section>
      ${subCta()}`;
  }

  /* ============ 下層:研修制度 ============ */
  function renderTrainingPage() {
    const root = $("#training-page"); if (!root) return;
    const t = S.training;
    document.title = `研修制度｜${S.brand.nameJa} 採用サイト`;
    root.innerHTML = `
      <div class="sub-hero">
        <div class="wrap">
          <p class="bc rv">TOP &gt; 研修制度</p>
          ${secHead(t.heading)}
        </div>
      </div>
      <section class="sec cul-intro">
        <div class="wrap">
          <div class="cul-intro-grid">
            <div class="cul-intro-txt">
              <span class="cul-intro-en rv">TRAINING</span>
              <h2 class="cul-intro-lead rv">${esc(t.lead)}</h2>
              <div class="cul-intro-body rv">${fmt(t.intro)}</div>
            </div>
            <div class="cul-intro-media rv">${imgBox(t.mainImg, "研修風景")}</div>
          </div>
        </div>
      </section>
      <section class="sec cul-sec">
        <div class="wrap">
          <div class="cul-list">
            ${t.features.map((f, i) => `
              <div class="cul-item rv ${i % 2 ? "is-rev" : ""}">
                <div class="cul-img">${imgBox(f.img, f.title + "の写真（後日差し替え）")}</div>
                <div class="cul-txt">
                  <div class="cul-no"><span class="cul-ic">${TRAIN_ICONS[f.icon] || TRAIN_ICONS.book}</span>TRAINING</div>
                  <h2>${esc(f.title)}</h2>
                  <p>${fmt(f.text)}</p>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </section>
      ${t.voices && t.voices.length ? `
      <section class="sec voice-sec">
        <div class="wrap">
          <div class="voice-head">
            <span class="sec-head-en">VOICE</span>
            <h2 class="voice-title">研修を受けたメンバーの声</h2>
          </div>
          <div class="voice-grid">
            ${t.voices.map(v => `
              <article class="voice-card rv">
                <div class="voice-photo">${imgBox(v.img, v.name)}</div>
                <div class="voice-body">
                  <h3>${esc(v.heading)}</h3>
                  <p>${fmt(v.text)}</p>
                  <div class="voice-meta">
                    <b>${esc(v.name)}</b>
                    <small>${esc(v.role)}${v.store ? " ・ " + esc(v.store) : ""}</small>
                  </div>
                </div>
              </article>`).join("")}
          </div>
        </div>
      </section>` : ""}
      ${subCta()}`;
  }

  /* ============ 下層:代表メッセージ ============ */
  function renderMessage() {
    const root = $("#message-page"); if (!root) return;
    const m = S.message;
    document.title = `代表メッセージ｜${S.brand.nameJa} 採用サイト`;
    root.innerHTML = `
      <div class="sub-hero">
        <div class="bg-en" aria-hidden="true">${esc(m.heading.en)}</div>
        <div class="wrap">
          <div class="crumb"><a href="index.html">TOP</a> ＞ 代表メッセージ</div>
          ${secHead(m.heading)}
        </div>
      </div>
      <section class="sec">
        <div class="wrap">
          <h2 class="msg-lead rv">${esc(m.lead)}</h2>
          <p class="msg-company rv">${esc(m.company || "")}<br>${esc(m.role || "")}</p>
          <p class="msg-name-big rv">${esc(m.name || "")}</p>
          <div class="msg-photo-hero rv">
            ${imgBox(m.photo, m.photoLabel)}
          </div>
          <p class="msg-label rv">MESSAGE</p>
          ${(m.sections || []).map(b => b.img !== undefined
            ? `<div class="msg-inline-img rv">${imgBox(b.img, b.label || "写真")}</div>`
            : `<div class="msg-body rv">${fmt(b.text)}</div>`).join("")}
          <p class="msg-sign rv">${esc(m.signature)}</p>
        </div>
      </section>
      <section class="sec sec--navy cta-sec" id="cta" style="text-align:center">
        <div class="cta-bg" aria-hidden="true">LINE US</div>
        <div class="wrap">
          ${secHead(S.cta.heading)}
          <div class="cta-lines rv">
            ${S.cta.lines.map(l => `<p>${esc(l)}</p>`).join("")}
          </div>
          <div class="rv rv-d1">${lineBtn(S.line.buttonText)}</div>
        </div>
      </section>`;
  }

  /* ============ 演出:スクロール出現・カウントアップ ============ */
  function observe() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          const num = en.target.querySelector ? en.target.querySelector("[data-count]") : null;
          if (num && !num.dataset.done) countUp(num);
          if (en.target.matches && en.target.matches("[data-count]") && !en.target.dataset.done) countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".rv").forEach(el => io.observe(el));
  }
  function countUp(el) {
    el.dataset.done = "1";
    const goal = parseInt(el.dataset.count, 10) || 0;
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(goal * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ============ 起動 ============ */
  document.addEventListener("DOMContentLoaded", () => {
    if ($("#hero")) document.title = S.brand.siteTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && !meta.content) meta.content = S.brand.description;

    renderChrome();
    renderHero();
    renderGallery();
    renderMovie();
    renderAbout();
    renderMap();
    renderEnv();
    renderCareer();
    renderTraining();
    renderInterviewTop();
    renderCTA();
    renderFlow();
    renderReq();
    renderInterviewPage();
    renderStory();
    renderMessage();
    renderBenefits();
    renderCulture();
    renderTrainingPage();
    observe();
    splash();
  });
})();
