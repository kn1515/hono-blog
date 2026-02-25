import { css, Style } from 'hono/css'
import { html, raw } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { MobileBottomBar } from '../components/MobileBottomBar'
import { Sidebar } from '../components/Sidebar'
import { getAllPostMeta } from '../lib/post-meta'
import { verticalRhythmUnit } from '../styles/variables'

const codeBlockFontSize = 14

/* ── Theme CSS Variables (injected as raw <style>) ── */
const themeVarsStyle = `
:root {
  --c-text: #1a1a2e;
  --c-text-muted: #64748b;
  --c-text-faint: #94a3b8;
  --c-accent: #2dd4bf;
  --c-accent-bg: rgba(45, 212, 191, 0.12);
  --c-accent-hover-bg: rgba(45, 212, 191, 0.08);
  --c-bg: #f0f2f5;
  --c-bg-alt: #f8fafc;
  --c-content-bg: #ffffff;
  --c-bg-info: #f4f4f5;
  --c-border: #e2e8f0;
  --c-border-light: #cbd5e1;
  --c-header-bg: rgba(255, 255, 255, 0.97);
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
  --c-bg: #232328;
  --c-bg-alt: #343438;
  --c-content-bg: #2c2c32;
  --c-bg-info: #38383e;
  --c-border: #46464e;
  --c-border-light: #56565e;
  --c-header-bg: rgba(44, 44, 50, 0.97);
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
/* Dark mode: brighten owl logo for visibility */
.dark .header-logo-owl {
  filter: brightness(1.6) contrast(0.9);
}
/* Theme toggle icon visibility */
#theme-toggle .icon-sun { display: block; }
#theme-toggle .icon-moon { display: none; }
.dark #theme-toggle .icon-sun { display: none; }
.dark #theme-toggle .icon-moon { display: block; }

/* Push Buy Me a Coffee widget above mobile bottom bar */
@media (max-width: 900px) {
  #bmc-wbtn {
    bottom: calc(56px + env(safe-area-inset-bottom, 0) + 18px) !important;
  }
}
`

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
`

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
`

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

  /* Sidebar search box: open modal on click (button natively supports Enter/Space) */
  var sidebarSearch = document.getElementById('sidebar-search-box');
  if (sidebarSearch) {
    sidebarSearch.addEventListener('click', openSearch);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display !== 'none') {
      closeSearch();
    }
  });
})();
`

/* ── Code block copy button script ── */
const codeCopyScript = `
(function(){
  document.addEventListener('click', function(e) {
    var btn = e.target && e.target.closest && e.target.closest('.code-copy-btn');
    if (!btn) return;
    var wrapper = btn.closest('.code-block-wrapper');
    if (!wrapper) return;
    var code = wrapper.querySelector('code');
    if (!code) return;
    var text = code.textContent || '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
    }
  });
})();
`

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
`

/* ── Left sidebar TOC with scroll spy ── */
const leftTocScript = `
(function(){
  var container = document.getElementById('left-toc-container');
  if (!container) return;

  /* Find article headings (h2, h3) with IDs */
  var article = document.querySelector('article');
  if (!article) return;
  var headings = article.querySelectorAll('h2[id], h3[id]');
  if (headings.length === 0) { container.style.display = 'none'; return; }

  /* Build TOC HTML */
  var html = '<nav id="left-toc" aria-label="Table of Contents">';
  html += '<div id="left-toc-title">目次</div>';
  html += '<ul id="left-toc-list">';
  for (var i = 0; i < headings.length; i++) {
    var h = headings[i];
    var level = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    html += '<li class="' + level + '">';
    html += '<a href="#' + h.id + '" data-toc-id="' + h.id + '">' + (h.textContent || '') + '</a>';
    html += '</li>';
  }
  html += '</ul></nav>';
  container.innerHTML = html;

  /* Scroll spy with IntersectionObserver */
  var tocLinks = container.querySelectorAll('a[data-toc-id]');
  var headingMap = {};
  for (var j = 0; j < tocLinks.length; j++) {
    headingMap[tocLinks[j].getAttribute('data-toc-id')] = tocLinks[j];
  }

  var currentActive = null;

  function setActive(id) {
    if (currentActive === id) return;
    if (currentActive && headingMap[currentActive]) {
      headingMap[currentActive].parentElement.classList.remove('is-active');
    }
    if (id && headingMap[id]) {
      headingMap[id].parentElement.classList.add('is-active');
      /* Scroll TOC item into view if needed */
      var tocList = document.getElementById('left-toc-list');
      var activeEl = headingMap[id].parentElement;
      if (tocList && activeEl) {
        var tocRect = tocList.getBoundingClientRect();
        var itemRect = activeEl.getBoundingClientRect();
        if (itemRect.top < tocRect.top || itemRect.bottom > tocRect.bottom) {
          activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
    currentActive = id;
  }

  /* Use IntersectionObserver for precise tracking */
  var headingIds = [];
  for (var k = 0; k < headings.length; k++) {
    headingIds.push(headings[k].id);
  }

  var observer = new IntersectionObserver(function(entries) {
    /* Find topmost visible heading */
    var visible = [];
    for (var m = 0; m < entries.length; m++) {
      if (entries[m].isIntersecting) {
        visible.push(entries[m].target.id);
      }
    }
    if (visible.length > 0) {
      /* Pick the first one in document order */
      for (var n = 0; n < headingIds.length; n++) {
        if (visible.indexOf(headingIds[n]) !== -1) {
          setActive(headingIds[n]);
          return;
        }
      }
    }
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  });

  for (var p = 0; p < headings.length; p++) {
    observer.observe(headings[p]);
  }

  /* Also track on scroll for when no heading is intersecting */
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      ticking = false;
      var scrollY = window.scrollY || window.pageYOffset;
      var found = null;
      for (var q = headings.length - 1; q >= 0; q--) {
        if (headings[q].getBoundingClientRect().top <= 100) {
          found = headings[q].id;
          break;
        }
      }
      if (found) setActive(found);
    });
  });

  /* Smooth scroll on click */
  container.addEventListener('click', function(e) {
    var link = e.target.closest && e.target.closest('a[data-toc-id]');
    if (!link) return;
    e.preventDefault();
    var target = document.getElementById(link.getAttribute('data-toc-id'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + link.getAttribute('data-toc-id'));
    }
  });
})();
`

const leftTocStyle = `
#left-toc-container {
  /* sticky is handled by the parent leftSidebarArea */
}
#left-toc {
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--c-border) transparent;
}
#left-toc-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-text-muted);
  margin-bottom: 0.6rem;
  padding-left: 0.75rem;
}
#left-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
#left-toc-list li {
  position: relative;
  border-left: 2px solid var(--c-border);
  transition: border-color 0.2s ease;
}
#left-toc-list li.toc-h3 {
  padding-left: 0.5rem;
}
#left-toc-list li a {
  display: block;
  padding: 0.3rem 0.5rem 0.3rem 0.75rem;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--c-text-muted);
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
#left-toc-list li.toc-h3 a {
  font-size: 0.73rem;
  padding-left: 1rem;
}
#left-toc-list li a:hover {
  color: var(--c-text);
}
#left-toc-list li.is-active {
  border-left-color: var(--c-accent);
}
#left-toc-list li.is-active a {
  color: var(--c-accent);
  font-weight: 600;
}
`

/* ── Popular articles script (fetches from /api/discussions) ── */
const popularArticlesScript = `
(function(){
  var section = document.getElementById('popular-articles-section');
  var container = document.getElementById('popular-articles-container');
  if (!section || !container) return;

  /* Get article data from search data (already embedded in page) */
  var postsData = [];
  try {
    var dataEl = document.getElementById('search-posts-data');
    if (dataEl) postsData = JSON.parse(dataEl.textContent || '[]');
  } catch(e) {}

  fetch('https://api.github.com/repos/kn1515/hono-blog/discussions?per_page=100')
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(discussions) {
      if (!discussions || discussions.length === 0) {
        section.style.display = 'none';
        return;
      }

      /* Filter to Comments category and sort by total reactions descending */
      var sorted = discussions
        .filter(function(d) { return d.category && d.category.name === 'Comments' && d.reactions && d.reactions.total_count > 0; })
        .sort(function(a, b) { return b.reactions.total_count - a.reactions.total_count; })
        .slice(0, 5);

      if (sorted.length === 0) {
        section.style.display = 'none';
        return;
      }

      var html = '<ul style="list-style:none;margin:0;padding:0">';
      for (var i = 0; i < sorted.length; i++) {
        var d = sorted[i];
        /* Discussion title is the pathname (giscus mapping) */
        var pathname = '/' + d.title;
        /* Find article title from posts data */
        var title = d.title;
        for (var j = 0; j < postsData.length; j++) {
          if (postsData[j].permalink === pathname) {
            title = postsData[j].title;
            break;
          }
        }
        html += '<li style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0;border-bottom:1px solid var(--c-border);line-height:1.55">';
        html += '<a href="' + pathname + '" style="font-size:0.9rem;color:var(--c-text);text-decoration:none;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + title.replace(/</g,'&lt;') + '</a>';
        html += '<span style="display:inline-flex;align-items:center;gap:0.2rem;font-size:0.75rem;color:var(--c-text-muted);flex-shrink:0;min-width:2.5rem;justify-content:flex-end">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        html += d.reactions.total_count + '</span></li>';
      }
      html += '</ul>';
      container.innerHTML = html;
      section.style.display = '';

      /* Remove last border */
      var lastLi = container.querySelector('li:last-child');
      if (lastLi) lastLi.style.borderBottom = 'none';
    })
    .catch(function() {
      section.style.display = 'none';
    });
})();
`

/* ── Like button script (for post pages) ── */
const likeButtonScript = `
(function(){
  var container = document.getElementById('like-button-container');
  if (!container) return;

  /* Only show on post pages */
  var path = window.location.pathname;
  if (path.indexOf('/posts/') === -1) {
    container.style.display = 'none';
    return;
  }

  /* Derive discussion search term from pathname (giscus uses pathname mapping) */
  var term = path.replace(/^\\//, '');

  function render(count, discussionUrl) {
    var label = 'GitHubでいいね';
    container.innerHTML =
      '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--c-border)">' +
      '<a id="like-btn" href="' + (discussionUrl || '#giscus-container') + '" ' + (discussionUrl ? 'target="_blank" rel="noopener noreferrer"' : '') + ' aria-label="' + label + '" style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;background:none;border:none;cursor:pointer;padding:0.5rem;color:var(--c-text-muted);transition:color 0.2s ease,transform 0.15s ease;width:100%;text-decoration:none">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' +
      '<span style="font-size:0.85rem;font-weight:600">' + count + '</span>' +
      '<span style="font-size:0.65rem;letter-spacing:0.02em">' + label + '</span>' +
      '</a></div>';

    var btn = document.getElementById('like-btn');
    if (btn) {
      btn.addEventListener('mouseenter', function() { btn.style.transform = 'scale(1.1)'; });
      btn.addEventListener('mouseleave', function() { btn.style.transform = 'scale(1)'; });
    }
  }

  /* Initial load */
  render(0, '');

  /* Fetch discussion data from GitHub REST API */
  fetch('https://api.github.com/repos/kn1515/hono-blog/discussions?per_page=100')
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(discussions) {
      if (!discussions) return;
      for (var i = 0; i < discussions.length; i++) {
        var d = discussions[i];
        if (d.title === term && d.category && d.category.name === 'Comments') {
          var thumbsUp = d.reactions ? d.reactions['+1'] || 0 : 0;
          render(thumbsUp, d.html_url);
          return;
        }
      }
    })
    .catch(function() {});
})();
`

/* ── Like button styles ── */
const likeButtonStyle = `
#like-button-container button:active {
  transform: scale(0.95) !important;
}
`

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

    .code-block-wrapper {
      position: relative;
    }
    .code-block-wrapper:hover .code-copy-btn {
      opacity: 1;
    }
    .code-copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.3rem 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.375rem;
      background: rgba(40, 44, 52, 0.7);
      color: #abb2bf;
      font-size: 0.75rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s ease, background 0.15s ease;
      z-index: 1;
      line-height: 1;
      backdrop-filter: blur(4px);
    }
    .code-copy-btn:hover {
      background: rgba(60, 64, 72, 0.9);
      color: #fff;
    }
  }
`

const wrapperCss = css`
  position: relative;
  min-height: 100vh;
  overflow: clip;
  isolation: isolate;
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
  z-index: -1;
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
  z-index: -1;
  pointer-events: none;
`

const mainCss = css`
  margin: 0 auto;
  max-width: 1360px;
  padding-top: 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  gap: 2rem;
  /* Ensure main contents never overlap the sticky header (z-index:100) */
  isolation: isolate;

  @media (max-width: 1100px) {
    max-width: 1000px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`

const leftSidebarAreaCss = css`
  width: 200px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 5rem;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;

  @media (max-width: 1100px) {
    display: none;
  }
`

const contentAreaCss = css`
  flex: 1;
  min-width: 0;
  max-width: 900px;
  background: var(--c-content-bg);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 4px var(--c-shadow-sm), 0 2px 12px var(--c-shadow);

  @media (max-width: 900px) {
    padding: 1rem 1.25rem;
    border-radius: 8px;
  }
`

const sidebarAreaCss = css`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    display: none;
  }
`

export default jsxRenderer(
  ({ children, title: propsTitle, frontmatter }, c) => {
    const description =
      frontmatter?.description ||
      'エンジニアリングに関する情報を発信するサイトです。'

    const title = propsTitle
      ? `${propsTitle} - ぽんろぐ備忘録`
      : 'ぽんろぐ備忘録'

    const siteUrl = 'https://www.ponnlog.com'
    const canonicalUrl = `${siteUrl}${c.req.path}`
    const isArticle = !!frontmatter?.title
    const ogType = isArticle ? 'article' : 'website'

    const ogImage = frontmatter?.ogImage
      ? `${siteUrl}${frontmatter.ogImage}`
      : frontmatter?.image
        ? `${siteUrl}${frontmatter.image}`
        : `${siteUrl}/static/ogp.png`

    const jsonLd = isArticle
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: frontmatter.title,
          description: frontmatter.description || description,
          image: ogImage,
          datePublished: frontmatter.date,
          dateModified: frontmatter.updatedAt || frontmatter.date,
          author: {
            '@type': 'Person',
            name: 'ぽん',
            url: `${siteUrl}/about/`,
          },
          publisher: {
            '@type': 'Organization',
            name: 'ぽんろぐ備忘録',
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/static/logo2.png`,
            },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        })
      : JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ぽんろぐ備忘録',
          url: siteUrl,
          description,
          author: { '@type': 'Person', name: 'ぽん' },
        })
    return (
      <html lang='ja'>
        <head>
          <meta charset='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          {/* Theme init (before paint to avoid flash) */}
          {html`<style>${raw(themeVarsStyle)}</style>`}
          {html`<style>${raw(leftTocStyle)}</style>`}
          {html`<style>${raw(likeButtonStyle)}</style>`}
          {html`<script>${raw(themeInitScript)}</script>`}
          {/* View toggle (list/grid switching) */}
          {html`<script>${raw(viewToggleScript)}</script>`}
          <title>{title}</title>

          <link rel='canonical' href={canonicalUrl} />
          <meta name='description' content={description} />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content={ogType} />
          <meta property='og:site_name' content='ぽんろぐ備忘録' />
          <meta property='og:description' content={description} />
          <meta property='og:image' content={ogImage} />
          <meta property='og:url' content={canonicalUrl} />
          <meta property='og:title' content={title} />
          {isArticle && frontmatter?.date && (
            <meta
              property='article:published_time'
              content={frontmatter.date}
            />
          )}
          {isArticle && frontmatter?.updatedAt && (
            <meta
              property='article:modified_time'
              content={frontmatter.updatedAt}
            />
          )}
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@Non_c5c' />
          <meta name='twitter:creator' content='@Non_c5c' />
          <meta name='twitter:title' content={title} />
          <meta name='twitter:description' content={description} />
          <meta name='twitter:image' content={ogImage} />
          {html`<script type="application/ld+json">${raw(jsonLd)}</script>`}

          {/*FIXME {import.meta.env.PROD ? <GoogleAnalytics /> : null}*/}

          <script
            src='https://kit.fontawesome.com/ea66b8338f.js'
            crossorigin='anonymous'
            async
          />
          <link
            rel='preconnect'
            href='https://kit.fontawesome.com'
            crossorigin='anonymous'
          />
          <link rel='preconnect' href='https://platform.twitter.com' />
          <link rel='preconnect' href='https://giscus.app' />
          <script
            async
            src='https://platform.twitter.com/widgets.js'
            charset='utf-8'
          />

          <link rel='icon' sizes='48x48' href='/static/favicon.ico' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/static/apple-touch-icon.png'
          />
          <link
            href='/index.xml'
            rel='alternate'
            type='application/rss+xml'
            title='ぽんろぐ備忘録 RSS Feed'
          />
          <Script src='/app/client.ts' async />
          <Style />
          {html`<script id="search-posts-data" type="application/json">${raw(
            JSON.stringify(getAllPostMeta()),
          )}</script>`}
        </head>
        <body class={bodyCss}>
          <a
            href='#main-content'
            style='position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;z-index:999'
            onFocus='this.style.position="static";this.style.width="auto";this.style.height="auto"'
            onBlur='this.style.position="absolute";this.style.left="-9999px";this.style.width="1px";this.style.height="1px"'
          >
            コンテンツへスキップ
          </a>
          <div class={wrapperCss}>
            <div class={glowTopCss} />
            <div class={glowBottomCss} />
            <Header />
            <main class={mainCss} id='main-content'>
              <div class={leftSidebarAreaCss}>
                <div id='left-toc-container' />
                <div id='like-button-container' />
              </div>
              <div class={contentAreaCss}>{children}</div>
              <div class={sidebarAreaCss} data-sidebar-area>
                <Sidebar recentPosts={getAllPostMeta()} />
              </div>
            </main>
            <Footer />
          </div>
          {/* Search Modal (hidden by default, toggled by vanilla JS) */}
          <div
            id='search-overlay'
            style='display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:300'
          />
          <div
            id='search-modal'
            style='display:none;position:fixed;top:15%;left:50%;transform:translateX(-50%);width:90%;max-width:560px;background:var(--c-panel-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--c-panel-border);border-radius:12px;box-shadow:0 8px 32px var(--c-shadow-lg);z-index:301;overflow:hidden'
          >
            <div style='display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem;border-bottom:1px solid var(--c-border)'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                style='flex-shrink:0'
              >
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              <input
                id='search-input'
                type='text'
                placeholder='記事を検索...'
                style='flex:1;border:none;background:transparent;color:var(--c-text);font-size:1rem;outline:none;font-family:inherit'
              />
              <button
                id='search-close-btn'
                type='button'
                aria-label='Close search'
                style='display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;border:none;background:transparent;color:var(--c-text-muted);cursor:pointer;padding:0'
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                >
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>
            <div
              id='search-results'
              style='max-height:400px;overflow-y:auto;padding:0.5rem'
            />
          </div>
          {html`<script>${raw(searchScript)}</script>`}
          {html`<script>${raw(leftTocScript)}</script>`}
          {html`<script>${raw(likeButtonScript)}</script>`}
          {html`<script>${raw(popularArticlesScript)}</script>`}
          <MobileBottomBar />
          {html`<script>${raw(mobileBarScript)}</script>`}
          {html`<script>${raw(codeCopyScript)}</script>`}
        </body>
      </html>
    )
  },
)

const _GoogleAnalytics = () => {
  return (
    <>
      <script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-xxxxxxxxxx'
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
  )
}
