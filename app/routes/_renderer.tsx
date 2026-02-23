import { Style, css } from "hono/css";
import { html, raw } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
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
  // Restore saved preference (default is grid)
  document.addEventListener('DOMContentLoaded',function(){
    var saved=localStorage.getItem('viewMode');
    if(saved==='list'){switchView('list');}
  });
  // Listen for toggle clicks
  document.addEventListener('click',function(e){
    var listBtn=e.target&&e.target.closest&&e.target.closest('#view-toggle-list');
    var gridBtn=e.target&&e.target.closest&&e.target.closest('#view-toggle-grid');
    if(listBtn){switchView('list');}
    else if(gridBtn){switchView('grid');}
  });
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
  max-width: 800px;
  position: relative;
  z-index: 1;
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
        </head>
        <body class={bodyCss}>
          <div class={wrapperCss}>
            <div class={glowTopCss} />
            <div class={glowBottomCss} />
            <Header />
            <main class={mainCss}>{children}</main>
            <Footer />
          </div>
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
