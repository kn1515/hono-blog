import { css } from "hono/css";

const toggleContainerCss = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const toggleButtonBaseCss = css`
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 0.375rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: var(--c-text-muted);
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  &:hover {
    border-color: var(--c-border-light);
    color: var(--c-text);
  }

  &[data-active="true"] {
    background-color: var(--c-accent-bg);
    border-color: var(--c-accent);
    color: var(--c-text);
  }
`;

export function ViewToggle() {
  return (
    <div class={toggleContainerCss}>
      <button
        type="button"
        id="view-toggle-list"
        class={toggleButtonBaseCss}
        data-active="false"
        aria-label="List view"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
      <button
        type="button"
        id="view-toggle-grid"
        class={toggleButtonBaseCss}
        data-active="true"
        aria-label="Grid view"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
    </div>
  );
}
