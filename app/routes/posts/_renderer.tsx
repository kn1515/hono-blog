import { format } from '@formkit/tempo'
import { css } from 'hono/css'
import { html, raw } from 'hono/html'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Author } from '../../components/Author'
import { PostDetails } from '../../components/PostDetails'
import { PostPagination } from '../../components/PostPagination'
import { RelatedPosts } from '../../components/RelatedPosts'
import { ShareDropdown } from '../../components/ShareDropdown'
import { ShareButtons } from '../../components/ShareIcons'
import { getRelatedPosts } from '../../lib/post-meta'
import { getPaginationPosts } from '../../lib/posts'
import { getRelativeDate, parseDate } from '../../lib/time'
import { gray, grayLight } from '../../styles/color'

/* ── Share dropdown toggle & clipboard copy (vanilla JS) ── */
const shareDropdownScript = `
(function(){
  var wrapper = document.getElementById('share-dropdown-wrapper');
  var toggle = document.getElementById('share-dropdown-toggle');
  var menu = document.getElementById('share-dropdown-menu');
  var copyBtn = document.getElementById('share-copy-url-btn');
  var toast = document.getElementById('share-copied-toast');
  if (!wrapper || !toggle || !menu) return;

  function openMenu() {
    menu.style.display = 'block';
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    menu.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (menu.style.display === 'block') { closeMenu(); }
    else { openMenu(); }
  });

  document.addEventListener('click', function(e) {
    if (!wrapper.contains(e.target)) { closeMenu(); }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeMenu(); }
  });

  if (copyBtn && toast) {
    copyBtn.addEventListener('click', function() {
      var url = copyBtn.getAttribute('data-url');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function() { showToast('コピーしました！'); });
      } else {
        fallbackCopy(url);
        showToast('コピーしました！');
      }
      closeMenu();
    });
    function showToast(msg) {
      toast.textContent = msg || 'コピーしました！';
      toast.style.display = 'block';
      toast.style.animation = 'none';
      toast.offsetHeight;
      toast.style.animation = '';
      setTimeout(function(){ toast.style.display = 'none'; }, 1500);
    }
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    /* Slack copy button */
    var slackBtn = document.getElementById('share-slack-btn');
    if (slackBtn) {
      slackBtn.addEventListener('click', function() {
        var url = slackBtn.getAttribute('data-url');
        var title = slackBtn.getAttribute('data-title');
        var text = title + '\\n' + url;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() { showToast('Slackに貼り付けてください'); });
        } else {
          fallbackCopy(text);
          showToast('Slackに貼り付けてください');
        }
        closeMenu();
      });
    }

    /* Discord copy button */
    var discordBtn = document.getElementById('share-discord-btn');
    if (discordBtn) {
      discordBtn.addEventListener('click', function() {
        var url = discordBtn.getAttribute('data-url');
        var title = discordBtn.getAttribute('data-title');
        var text = title + '\\n' + url;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() { showToast('Discordに貼り付けてください'); });
        } else {
          fallbackCopy(text);
          showToast('Discordに貼り付けてください');
        }
        closeMenu();
      });
    }
  }
})();
`

/* ── Slack / Discord circular icon buttons – copy to clipboard ── */
const shareIconCopyScript = `
(function(){
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  function showCopyToast(msg) {
    var existing = document.getElementById('share-icon-toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.id = 'share-icon-toast';
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);padding:0.5rem 1rem;background:var(--c-accent);color:#fff;border-radius:8px;font-size:0.85rem;z-index:9999;pointer-events:none;';
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity 0.3s'; }, 1200);
    setTimeout(function(){ t.remove(); }, 1600);
  }
  document.querySelectorAll('[data-share-slack]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var url = el.getAttribute('data-url');
      var title = el.getAttribute('data-title');
      var text = title + '\\n' + url;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function(){ showCopyToast('Slackに貼り付けてください'); });
      } else {
        fallbackCopy(text);
        showCopyToast('Slackに貼り付けてください');
      }
    });
  });
  document.querySelectorAll('[data-share-discord]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var url = el.getAttribute('data-url');
      var title = el.getAttribute('data-title');
      var text = title + '\\n' + url;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function(){ showCopyToast('Discordに貼り付けてください'); });
      } else {
        fallbackCopy(text);
        showCopyToast('Discordに貼り付けてください');
      }
    });
  });
})();
`

/* ── giscus comment widget (vanilla JS) ── */
const giscusScript = `
(function(){
  var container = document.getElementById('giscus-container');
  if (!container) return;
  var isDark = document.documentElement.classList.contains('dark');
  var theme = isDark ? 'dark' : 'light';
  var script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'kn1515/hono-blog');
  script.setAttribute('data-repo-id', 'R_kgDONGoI-A');
  script.setAttribute('data-category', 'Comments');
  script.setAttribute('data-category-id', 'DIC_kwDONGoI-M4C3CnG');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  script.setAttribute('data-theme', theme);
  script.setAttribute('data-lang', 'ja');
  script.crossOrigin = 'anonymous';
  script.async = true;
  container.appendChild(script);

  /* Sync giscus theme when dark mode is toggled */
  var observer = new MutationObserver(function() {
    var nowDark = document.documentElement.classList.contains('dark');
    var newTheme = nowDark ? 'dark' : 'light';
    var iframe = container.querySelector('iframe.giscus-frame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: newTheme } } },
        'https://giscus.app'
      );
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
})();
`

const postTitleCss = css`
  font-size: 2.5rem;
  margin: 0 0 1.7rem;
  text-align: left;
  line-height: 3.4rem;
  word-break: auto-phrase;

  @media (max-width: 900px) {
    font-size: 1.75rem;
    line-height: 2.55rem;
  }
`

const postDateCss = css`
  color: ${grayLight};
  letter-spacing: 1px;
  text-align: left;
  padding: 1.275rem 0 0.85rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
`

const relativeDateCss = css`
  font-size: 0.85rem;
  color: ${grayLight};
  opacity: 0.8;
`

const updatedAtCss = css`
  font-size: 0.9rem;
  color: ${grayLight};
`

const toTopLinkCss = css`
  text-align: left;

  & a {
    color: ${gray};
    text-decoration: none;

    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;

    &:hover {
      color: ${grayLight};
    }
  }
`

const articleCss = css`
  overflow-wrap: break-word;
  word-break: break-word;
`

export default jsxRenderer(({ children, Layout, frontmatter, filepath }) => {
  if (!(frontmatter && filepath)) {
    return <div>Not Post Page</div>
  }

  const paginationPosts = getPaginationPosts(frontmatter.title)

  const currentPermalink = `/${filepath
    .replaceAll('app/routes/', '')
    .replaceAll('index.mdx', '')}`
  const relatedPosts = getRelatedPosts(
    currentPermalink,
    frontmatter.categories ?? [],
    frontmatter.tags ?? [],
    3,
  )

  const permalink = `${import.meta.env.BASE_URL}${filepath
    .replaceAll('app/routes/', '')
    .replaceAll('index.mdx', '')}`

  return (
    <Layout title={frontmatter.title} frontmatter={frontmatter}>
      <div class={postDateCss}>
        <time datetime={frontmatter.date}>
          {format(parseDate(frontmatter.date), 'YYYY/MM/DD')}
        </time>
        <span class={relativeDateCss}>
          ({getRelativeDate(frontmatter.date)})
        </span>
        {frontmatter.updatedAt && (
          <span class={updatedAtCss}>
            更新日:{' '}
            <time datetime={frontmatter.updatedAt}>
              {format(parseDate(frontmatter.updatedAt), 'YYYY/MM/DD')}
            </time>
          </span>
        )}
      </div>
      <h1 class={postTitleCss}>{frontmatter.title}</h1>
      <ShareDropdown title={frontmatter.title} permalink={permalink} />
      <PostDetails frontmatter={frontmatter} />
      <article class={articleCss}>{children}</article>
      <ShareButtons title={frontmatter.title} permalink={permalink} />
      <Author />
      <RelatedPosts posts={relatedPosts} />
      <div id='giscus-container' />
      <PostPagination paginationPosts={paginationPosts} />
      <div class={toTopLinkCss}>
        <a href='/'>Topへ戻る</a>
      </div>
      {html`<script>${raw(shareDropdownScript)}</script>`}
      {html`<script>${raw(shareIconCopyScript)}</script>`}
      {html`<script>${raw(giscusScript)}</script>`}
    </Layout>
  )
})
