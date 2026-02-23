import { Style, css } from "hono/css";
import { html, raw } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { Sidebar } from "../components/Sidebar";
import { getAllPosts } from "../lib/posts";
import { verticalRhythmUnit } from "../styles/variables";

const codeBlockFontSize = 14;

/* ── Theme CSS Variables (injected as raw <style>) ── */
const themeVarsStyle = `
:root {
  --c-text: #1a1a2e;
  --c-text-muted: #64748b;
  --c-text-faint: #94a3b8;
  --c-accent: #2dd4bf;
  --c-accent-bg: rgba(45, 212, 191, 0.12);
  --c-accent-hover-bg: rgba(45, 212, 191, 0.08);
  --c-bg: #ffffff;
  --c-bg-alt: #f8fafc;
  --c-bg-info: #f4f4f5;
  --c-border: #e2e8f0;
  --c-border-light: #cbd5e1;
  --c-header-bg: rgba(255, 255, 255, 0.85);
  --c-header-border: rgba(226, 232, 240, 0.6);
  --c-panel-bg: rgba(255, 255, 255, 0.97);
  --c-panel-border: rgba(226, 232, 240, 0.6);
  --c-shadow-sm: rgba(0, 0, 0, 0.04);
  --c-shadow: rgba(0, 0, 0, 0.06);
  --c-shadow-lg: rgba(0, 0, 0, 0.1);
  --c-glow: rgba(20, 184, 166, 0.05);
  --c-divider: rgba(226, 232, 240, 0.8);
  --c-code-bg: #f1f5f9;
  --c-code-border: #e2e8f0;
  --c-social-bg: #e2e8f0;
  --c-social-text: #64748b;
  --c-sns-icon: #475569;
  --c-hover-bg: #f1f5f9;
  --c-hover-border: #cbd5e1;
  --c-card-bg: #ffffff;
  --c-card-border: #e2e8f0;
  --c-link-border: rgba(0, 0, 0, 0.08);
  --c-section-border: #e2e8f0;
  --c-share-hover: #e2e8f0;
  --c-x-hover-bg: #555555;
  color-scheme: light;
}
.dark {
  --c-text: #d8d8dc;
  --c-text-muted: #9a9aa6;
  --c-text-faint: #6e6e7a;
  --c-accent: #2dd4bf;
  --c-accent-bg: rgba(45, 212, 191, 0.12);
  --c-accent-hover-bg: rgba(45, 212, 191, 0.08);
  --c-bg: #2c2c32;
  --c-bg-alt: #343438;
  --c-bg-info: #38383e;
  --c-border: #46464e;
  --c-border-light: #56565e;
  --c-header-bg: rgba(44, 44, 50, 0.92);
  --c-header-border: rgba(70, 70, 78, 0.6);
  --c-panel-bg: rgba(52, 52, 56, 0.97);
  --c-panel-border: rgba(86, 86, 94, 0.6);
  --c-shadow-sm: rgba(0, 0, 0, 0.1);
  --c-shadow: rgba(0, 0, 0, 0.14);
  --c-shadow-lg: rgba(0, 0, 0, 0.22);
  --c-glow: rgba(20, 184, 166, 0.1);
  --c-divider: rgba(86, 86, 94, 0.8);
  --c-code-bg: #343438;
  --c-code-border: #46464e;
  --c-social-bg: #46464e;
  --c-social-text: #9a9aa6;
  --c-sns-icon: #d8d8dc;
  --c-hover-bg: #3c3c42;
  --c-hover-border: #56565e;
  --c-card-bg: #343438;
  --c-card-border: #46464e;
  --c-link-border: rgba(255, 255, 255, 0.1);
  --c-section-border: #46464e;
  --c-share-hover: #56565e;
  --c-x-hover-bg: #4e4e56;
  color-scheme: dark;
}
/* Theme toggle icon visibility */
#theme-toggle .icon-sun { display: block; }
#theme-toggle .icon-moon { display: none; }
.dark #theme-toggle .icon-sun { display: none; }
.dark #theme-toggle .icon-moon { display: block; }
`;

/* ── Theme toggle script (runs before paint to avoid flash) ── */
const themeInitScript = `
(function(){
  var s=localStorage.getItem('theme');
  var prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  if(s==='dark'||(s!=='light' ? prefersDark : false)){
    document.documentElement.classList.add('dark');
  }
  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest&&e.target.closest('#theme-toggle');
    if(!btn)return;
    var isDark=document.documentElement.classList.toggle('dark');
    try{localStorage.setItem('theme',isDark?'dark':'light')}catch(x){}
  });
  /* Close accordion menu when clicking outside */
  document.addEventListener('click',function(e){
    var details=document.querySelectorAll('header details[open]');
    for(var i=0;i<details.length;i++){
      if(!details[i].contains(e.target)){
        details[i].removeAttribute('open');
      }
    }
  });
})();
`;

/* ── View toggle script (list/grid switching) ── */
const viewToggleScript = `
(function(){
  function switchView(mode){
    var listView=document.getElementById('post-list-view');
    var gridView=document.getElementById('post-grid-view');
    var listBtn=document.getElementById('view-toggle-list');
    var gridBtn=document.getElementById('view-toggle-grid');
    if(!listView||!gridView||!listBtn||!gridBtn)return;
    if(mode==='grid'){
      listView.style.display='none';
      gridView.style.display='';
      listBtn.setAttribute('data-active','false');
      gridBtn.setAttribute('data-active','true');
    }else{
      listView.style.display='';
      gridView.style.display='none';
      listBtn.setAttribute('data-active','true');
      gridBtn.setAttribute('data-active','false');
    }
    try{localStorage.setItem('viewMode',mode)}catch(x){}
  }
  document.addEventListener('DOMContentLoaded',function(){
    var saved=localStorage.getItem('viewMode');
    if(saved==='list'){switchView('list');}
  });
  document.addEventListener('click',function(e){
    var listBtn=e.target&&e.target.closest&&e.target.closest('#view-toggle-list');
    var gridBtn=e.target&&e.target.closest&&e.target.closest('#view-toggle-grid');
    if(listBtn){switchView('list');}
    else if(gridBtn){switchView('grid');}
  });
})();
`;

/* ── Search script (vanilla JS, runs after DOM is ready) ── */
const searchScript = `
(function(){
  var openBtn = document.getElementById('search-open-btn');
  var overlay = document.getElementById('search-overlay');
  var modal = document.getElementById('search-modal');
  var input = document.getElementById('search-input');
  var closeBtn = document.getElementById('search-close-btn');
  var results = document.getElementById('search-results');
  if (!openBtn || !overlay || !modal || !input || !closeBtn || !results) return;

  var posts = [];
  try {
    var dataEl = document.getElementById('search-posts-data');
    if (dataEl) posts = JSON.parse(dataEl.textContent || '[]');
  } catch(e) {}

  function formatDate(d) {
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    var y = dt.getFullYear();
    var m = ('0'+(dt.getMonth()+1)).slice(-2);
    var day = ('0'+dt.getDate()).slice(-2);
    return y+'/'+m+'/'+day;
  }

  function openSearch() {
    overlay.style.display = 'block';
    modal.style.display = 'block';
    input.value = '';
    results.innerHTML = '<div style="padding:2rem 1rem;text-align:center;color:var(--c-text-faint);font-size:0.85rem">タイトル、説明、カテゴリ、タグで検索できます</div>';
    setTimeout(function(){ input.focus(); }, 50);
  }

  function closeSearch() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
    input.value = '';
  }

  function renderResults(query) {
    if (!query.trim()) {
      results.innerHTML = '<div style="padding:2rem 1rem;text-align:center;color:var(--c-text-faint);font-size:0.85rem">タイトル、説明、カテゴリ、タグで検索できます</div>';
      return;
    }
    var q = query.toLowerCase();
    var filtered = posts.filter(function(p) {
      return p.title.toLowerCase().indexOf(q) !== -1 ||
        p.description.toLowerCase().indexOf(q) !== -1 ||
        (p.categories || []).some(function(c){ return c.toLowerCase().indexOf(q) !== -1; }) ||
        (p.tags || []).some(function(t){ return t.toLowerCase().indexOf(q) !== -1; });
    });
    if (filtered.length === 0) {
      results.innerHTML = '<div style="padding:2rem 1rem;text-align:center;color:var(--c-text-muted);font-size:0.9rem">「' + query.replace(/</g,'&lt;') + '」に一致する記事が見つかりませんでした</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var p = filtered[i];
      var imgHtml = p.image
        ? '<img src="'+p.image+'" alt="" style="width:48px;height:48px;border-radius:6px;object-fit:cover;flex-shrink:0">'
        : '<div style="width:48px;height:48px;border-radius:6px;background:var(--c-bg-alt);display:flex;align-items:center;justify-content:center;color:var(--c-text-faint);font-size:0.7rem;flex-shrink:0">No Image</div>';
      var cats = (p.categories || []).join(', ');
      var meta = formatDate(p.date) + (cats ? ' / ' + cats : '');
      html += '<a href="'+p.permalink+'" style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.75rem;border-radius:8px;text-decoration:none;color:var(--c-text);transition:background 0.15s ease" onmouseover="this.style.background=\\'var(--c-accent-hover-bg)\\'" onmouseout="this.style.background=\\'transparent\\'">'
        + imgHtml
        + '<div style="flex:1;min-width:0">'
        + '<div style="font-size:0.9rem;font-weight:600;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p.title.replace(/</g,'&lt;') + '</div>'
        + '<div style="font-size:0.75rem;color:var(--c-text-muted);margin-top:0.15rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + meta + '</div>'
        + '</div></a>';
    }
    results.innerHTML = html;
  }

  openBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', closeSearch);
  input.addEventListener('input', function(){ renderResults(input.value); });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display !== 'none') {
      closeSearch();
    }
  });
})();
`;

/* ── Mobile bottom bar script ── */
const mobileBarScript = `
(function(){
  /* Sidebar drawer */
  var sidebarBtn = document.getElementById('mobile-sidebar-btn');
  var sidebarOverlay = document.getElementById('sidebar-overlay');
  var sidebarDrawer = document.getElementById('sidebar-drawer');
  var sidebarArea = document.querySelector('[data-sidebar-area]');

  function openSidebar() {
    if (!sidebarDrawer || !sidebarOverlay) return;
    /* Clone sidebar content into drawer if empty */
    if (sidebarArea && sidebarDrawer.children.length === 0) {
      sidebarDrawer.innerHTML = sidebarArea.innerHTML;
    }
    sidebarOverlay.style.display = 'block';
    sidebarDrawer.style.display = 'block';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        sidebarOverlay.classList.add('is-open');
        sidebarDrawer.classList.add('is-open');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebarDrawer || !sidebarOverlay) return;
    sidebarOverlay.classList.remove('is-open');
    sidebarDrawer.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function() {
      sidebarOverlay.style.display = 'none';
      sidebarDrawer.style.display = 'none';
    }, 300);
  }

  if (sidebarBtn) sidebarBtn.addEventListener('click', openSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  /* Category dropdown */
  var catBtn = document.getElementById('mobile-category-btn');
  var catOverlay = document.getElementById('category-overlay');
  var catDropdown = document.getElementById('category-dropdown');

  function openCategory() {
    if (!catDropdown || !catOverlay) return;
    catOverlay.style.display = 'block';
    catDropdown.style.display = 'block';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        catOverlay.classList.add('is-open');
        catDropdown.classList.add('is-open');
      });
    });
  }

  function closeCategory() {
    if (!catDropdown || !catOverlay) return;
    catOverlay.classList.remove('is-open');
    catDropdown.classList.remove('is-open');
    setTimeout(function() {
      catOverlay.style.display = 'none';
      catDropdown.style.display = 'none';
    }, 300);
  }

  if (catBtn) catBtn.addEventListener('click', openCategory);
  if (catOverlay) catOverlay.addEventListener('click', closeCategory);

  /* Scroll to top */
  var topBtn = document.getElementById('mobile-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Search (reuse existing search modal) */
  var searchBtn = document.getElementById('mobile-search-btn');
  var searchOpenBtn = document.getElementById('search-open-btn');
  if (searchBtn && searchOpenBtn) {
    searchBtn.addEventListener('click', function() {
      searchOpenBtn.click();
    });
  }
})();
`;

const bodyCss = css`
  :-hono-global {
    body {
      color: var(--c-text);
      background-color: var(--c-bg);
      font-size: 16px;
      font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Segoe UI",
        "Roboto", "Noto Sans CJK JP", sans-serif, "Apple Color Emoji",
        "Segoe UI", "Emoji,Segoe UI", Symbol, "Noto Sans Emoji";

      margin: 0 1rem;
      padding: 0;

      -webkit-text-size-adjust: 100%;
      transition: background-color 0.3s ease, color 0.3s ease;

      @media (max-width: 900px) {
        padding-bottom: calc(56px + env(safe-area-inset-bottom, 0));
      }
    }

    h2 {
      line-height: 2.55rem;
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1.3rem;
      line-height: 2.55rem;
      border-bottom: 1px solid var(--c-border);
    }

    p {
      margin: 0 0 1.7rem;
      line-height: 1.7rem;
      @media (max-width: 600px) {
        line-height: 2rem;
      }
    }

    code {
      background-color: var(--c-code-bg);
      border: 1px solid var(--c-code-border);
      border-radius: ${verticalRhythmUnit * 0.125}rem;
      font-family: monospace;
      font-size: 85%;
      padding: ${verticalRhythmUnit * 0.125}rem 0.5em;
    }

    .hljs {
      color: #abb2bf;
      background: #282c34;
    }
    .hljs-comment,
    .hljs-quote {
      color: #5c6370;
      font-style: italic;
    }
    .hljs-doctag,
    .hljs-keyword,
    .hljs-formula {
      color: #c678dd;
    }
    .hljs-section,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-deletion,
    .hljs-subst {
      color: #e06c75;
    }
    .hljs-literal {
      color: #56b6c2;
    }
    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta .hljs-string {
      color: #98c379;
    }
    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-type,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-number {
      color: #d19a66;
    }
    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-title {
      color: #61aeee;
    }
    .hljs-built_in,
    .hljs-title.class_,
    .hljs-class .hljs-title {
      color: #e6c07b;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: bold;
    }
    .hljs-link {
      text-decoration: underline;
    }

    code.hljs {
      display: block;
      overflow-x: auto;
      padding: ${verticalRhythmUnit * 0.5}rem;

      font-size: ${codeBlockFontSize}px;
      font-family: monospace;
      border: none;
    }

    .emgithub-file .code-area td.hljs-ln-line {
      font-size: ${codeBlockFontSize}px !important;
      font-family: monospace !important;
    }
  }
`;

const wrapperCss = css`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`

const glowTopCss = css`
  position: fixed;
  top: -6rem;
  right: -6rem;
  width: 24rem;
  height: 24rem;
  background: var(--c-glow);
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
`

const glowBottomCss = css`
  position: fixed;
  bottom: -8rem;
  left: -8rem;
  width: 24rem;
  height: 24rem;
  background: var(--c-glow);
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
`

const mainCss = css`
  margin: 0 auto;
  max-width: 1280px;
  padding-top: 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  gap: 2rem;

  @media (max-width: 1100px) {
    max-width: 1000px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const leftSidebarAreaCss = css`
  width: 200px;
  flex-shrink: 0;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const contentAreaCss = css`
  flex: 1;
  min-width: 0;
  max-width: 800px;
`;

const sidebarAreaCss = css`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    display: none;
  }
`;

export default jsxRenderer(
  ({ children, title: propsTitle, frontmatter }, c) => {
    const description =
      frontmatter?.description ||
      "エンジニアリングに関する情報を発信するサイトです。";

    const title = propsTitle
      ? `${propsTitle} - ぽんろぐ備忘録`
      : "ぽんろぐ備忘録";

    const ogImage = frontmatter?.ogImage
      ? `https://www.ponnlog.com${frontmatter.ogImage}`
      : frontmatter?.title
      ? "https://www.ponnlog.com/static/ogp.png"
      : "https://www.ponnlog.com/static/ogp.png";
    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          {/* Theme init (before paint to avoid flash) */}
          {html`<style>${raw(themeVarsStyle)}</style>`}
          {html`<script>${raw(themeInitScript)}</script>`}
          {/* View toggle (list/grid switching) */}
          {html`<script>${raw(viewToggleScript)}</script>`}
          <title>{title}</title>

          <meta name="description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={ogImage} />
          <meta
            property="og:url"
            content={`https://www.ponnlog.com${c.req.path}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Non_c5c" />
          <meta name="twitter:creator" content="@Non_c5c" />
          <meta property="og:title" content={title} />

          {/*FIXME {import.meta.env.PROD ? <GoogleAnalytics /> : null}*/}

          <script
            src="https://kit.fontawesome.com/ea66b8338f.js"
            crossorigin="anonymous"
            async
          />
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          />

          <link rel="icon" sizes="48x48" href="/static/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            href="/index.xml"
            rel="alternate"
            type="application/rss+xml"
            title="TODO"
          />
          <Script src="/app/client.ts" async />
          <Style />
          {html`<script id="search-posts-data" type="application/json">${raw(
            JSON.stringify(
              getAllPosts().map(p => ({
                title: p.frontmatter.title,
                permalink: p.permalink,
                date: p.frontmatter.date,
                description: p.frontmatter.description || '',
                categories: p.frontmatter.categories || [],
                tags: p.frontmatter.tags || [],
                image: p.frontmatter.image || undefined,
              })),
            ),
          )}</script>`}
        </head>
        <body class={bodyCss}>
          <div class={wrapperCss}>
            <div class={glowTopCss} />
            <div class={glowBottomCss} />
            <Header />
            <main class={mainCss}>
              <div class={leftSidebarAreaCss}>
                {/* 左サイドバー（将来拡張用） */}
              </div>
              <div class={contentAreaCss}>{children}</div>
              <div class={sidebarAreaCss} data-sidebar-area>
                <Sidebar recentPosts={getAllPosts()} />
              </div>
            </main>
            <Footer />
          </div>
          {/* Search Modal (hidden by default, toggled by vanilla JS) */}
          <div id="search-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:300" />
          <div id="search-modal" style="display:none;position:fixed;top:15%;left:50%;transform:translateX(-50%);width:90%;max-width:560px;background:var(--c-panel-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--c-panel-border);border-radius:12px;box-shadow:0 8px 32px var(--c-shadow-lg);z-index:301;overflow:hidden">
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem;border-bottom:1px solid var(--c-border)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input id="search-input" type="text" placeholder="記事を検索..." style="flex:1;border:none;background:transparent;color:var(--c-text);font-size:1rem;outline:none;font-family:inherit" />
              <button id="search-close-btn" type="button" aria-label="Close search" style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;border:none;background:transparent;color:var(--c-text-muted);cursor:pointer;padding:0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div id="search-results" style="max-height:400px;overflow-y:auto;padding:0.5rem" />
          </div>
          {html`<script>${raw(searchScript)}</script>`}
          <MobileBottomBar />
          {html`<script>${raw(mobileBarScript)}</script>`}
        </body>
      </html>
    );
  }
);

const GoogleAnalytics = () => {
  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-xxxxxxxxxx"
      />
      {html`
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());

          gtag("config", "G-xxxxxxxxxx");
        </script>
      `}
    </>
  );
};
