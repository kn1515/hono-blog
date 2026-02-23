import { format } from "@formkit/tempo";
import { css } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { html, raw } from "hono/html";
import { Author } from "../../components/Author";
import { PostDetails } from "../../components/PostDetails";
import { PostPagination } from "../../components/PostPagination";
import { ShareDropdown } from "../../components/ShareDropdown";
import { ShareButtons } from "../../components/ShareIcons";
import GiscusComments from "../../islands/GiscusComments";
import { getPaginationPosts } from "../../lib/posts";
import { parseDate } from "../../lib/time";
import { gray, grayLight } from "../../styles/color";

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
`;

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
`;

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
`;

const postDateCss = css`
  color: ${grayLight};
  letter-spacing: 1px;
  text-align: left;
  padding: 1.275rem 0 0.85rem;
`;

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
`;

export default jsxRenderer(({ children, Layout, frontmatter, filepath }) => {
  if (!(frontmatter && filepath)) {
    return <div>Not Post Page</div>;
  }

  const paginationPosts = getPaginationPosts(frontmatter.title);

  const permalink = `${import.meta.env.BASE_URL}${filepath
    .replaceAll("app/routes/", "")
    .replaceAll("index.mdx", "")}`;

  return (
    <Layout title={frontmatter.title} frontmatter={frontmatter}>
      <div class={postDateCss}>
        <time datetime={frontmatter.date}>
          {format(parseDate(frontmatter.date), "YYYY/MM/DD")}
        </time>
      </div>
      <h1 class={postTitleCss}>{frontmatter.title}</h1>
      <ShareDropdown title={frontmatter.title} permalink={permalink} />
      <PostDetails frontmatter={frontmatter} />
      <article>{children}</article>
      <ShareButtons title={frontmatter.title} permalink={permalink} />
      <Author />
      <GiscusComments />
      <PostPagination paginationPosts={paginationPosts} />
      <div class={toTopLinkCss}>
        <a href="/">Topへ戻る</a>
      </div>
      {html`<script>${raw(shareDropdownScript)}</script>`}
      {html`<script>${raw(shareIconCopyScript)}</script>`}
    </Layout>
  );
});
