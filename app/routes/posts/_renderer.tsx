import { format } from "@formkit/tempo";
import { css } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { html, raw } from "hono/html";
import { Author } from "../../components/Author";
import { PostDetails } from "../../components/PostDetails";
import { PostPagination } from "../../components/PostPagination";
import { ShareDropdown } from "../../components/ShareDropdown";
import { ShareButtons } from "../../components/ShareIcons";
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
        navigator.clipboard.writeText(url).then(function() { showToast(); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast();
      }
      closeMenu();
    });
    function showToast() {
      toast.style.display = 'block';
      toast.style.animation = 'none';
      toast.offsetHeight;
      toast.style.animation = '';
      setTimeout(function(){ toast.style.display = 'none'; }, 1500);
    }
  }
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
      <PostPagination paginationPosts={paginationPosts} />
      <div class={toTopLinkCss}>
        <a href="/">Topへ戻る</a>
      </div>
      {html`<script>${raw(shareDropdownScript)}</script>`}
    </Layout>
  );
});
