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

const lineIconBgCss = css`
  ${iconWrapCss}
  background: #06c755;
  color: #fff;
  font-weight: bold;
  font-size: 0.75rem;
`;

const slackIconBgCss = css`
  ${iconWrapCss}
  background: #4a154b;
  color: #fff;
`;

const discordIconBgCss = css`
  ${iconWrapCss}
  background: #5865f2;
  color: #fff;
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
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;

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
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noreferrer noopener"
          class={dropdownItemCss}
        >
          <span class={lineIconBgCss}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </span>
          <span class={labelCss}>LINEでシェア</span>
        </a>
        <button
          type="button"
          class={dropdownItemCss}
          id="share-slack-btn"
          data-url={fullUrl}
          data-title={title}
        >
          <span class={slackIconBgCss}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.164 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.164 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.314A2.528 2.528 0 0 1 24 15.164a2.528 2.528 0 0 1-2.522 2.521h-6.314z"/>
            </svg>
          </span>
          <span class={labelCss}>Slackにコピー</span>
        </button>
        <button
          type="button"
          class={dropdownItemCss}
          id="share-discord-btn"
          data-url={fullUrl}
          data-title={title}
        >
          <span class={discordIconBgCss}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </span>
          <span class={labelCss}>Discordにコピー</span>
        </button>
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
