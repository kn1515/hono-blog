import { css } from "hono/css";

const wrapperCss = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
  position: relative;
`;

const shareToggleBtnCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-text-muted);
  background: var(--c-bg-alt);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    color: var(--c-text);
    border-color: var(--c-border-light);
    background: var(--c-hover-bg);
  }
`;

const dropdownCss = css`
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 200px;
  background: var(--c-panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--c-panel-border);
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--c-shadow), 0 1px 3px var(--c-shadow-sm);
  z-index: 100;
  overflow: hidden;
  padding: 0.35rem;
`;

const dropdownItemCss = css`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  font-size: 0.85rem;
  color: var(--c-text);
  text-decoration: none;
  border-radius: 7px;
  transition: background 0.12s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  font-family: inherit;

  &:hover {
    background: var(--c-accent-hover-bg);
  }
`;

const iconWrapCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const xIconBgCss = css`
  ${iconWrapCss}
  background: #000;
  color: #fff;
  font-family: Verdana;
  font-weight: bold;
  font-size: 0.95rem;

  .dark & {
    background: #333;
  }
`;

const hatenaIconBgCss = css`
  ${iconWrapCss}
  background: transparent;
  border: 1.5px solid #4ba3d9;
  color: #4ba3d9;
  font-family: Verdana;
  font-weight: bold;
  font-size: 0.8rem;
`;

const copyIconBgCss = css`
  ${iconWrapCss}
  color: var(--c-text-muted);
`;

const labelCss = css`
  flex: 1;
  text-align: left;
`;

const copiedToastCss = css`
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  color: #fff;
  background: var(--c-accent);
  border-radius: 8px;
  white-space: nowrap;
  z-index: 101;
  pointer-events: none;
  animation: shareDropdownFadeOut 1.5s ease forwards;

  @keyframes shareDropdownFadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

type Props = {
  title: string;
  permalink: string;
};

export function ShareDropdown({ title, permalink }: Props) {
  const fullUrl = `https://www.ponnlog.com${permalink}`;
  const encodedTitle = encodeURIComponent(`${title} - ぽんろぐ備忘録`);
  const encodedUrl = encodeURIComponent(fullUrl);

  const xShareUrl = `http://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const hatenaShareUrl = `http://b.hatena.ne.jp/add?mode=confirm&url=${encodedUrl}&title=${encodedTitle}`;

  return (
    <div class={wrapperCss} id="share-dropdown-wrapper">
      <button
        type="button"
        class={shareToggleBtnCss}
        id="share-dropdown-toggle"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        シェアする
      </button>

      <div class={dropdownCss} id="share-dropdown-menu">
        <a
          href={xShareUrl}
          target="_blank"
          rel="noreferrer noopener"
          class={dropdownItemCss}
        >
          <span class={xIconBgCss}>𝕏</span>
          <span class={labelCss}>Xでシェア</span>
        </a>
        <a
          href={hatenaShareUrl}
          target="_blank"
          rel="noreferrer noopener"
          class={dropdownItemCss}
        >
          <span class={hatenaIconBgCss}>B!</span>
          <span class={labelCss}>はてなブックマーク</span>
        </a>
        <button
          type="button"
          class={dropdownItemCss}
          id="share-copy-url-btn"
          data-url={fullUrl}
        >
          <span class={copyIconBgCss}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </span>
          <span class={labelCss}>URLをコピー</span>
        </button>
      </div>

      <div class={copiedToastCss} id="share-copied-toast">
        コピーしました！
      </div>
    </div>
  );
}
