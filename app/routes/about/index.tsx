import { css, keyframes } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { gray } from '../../styles/color'

/* ── Inline SVG Icons ── */
const svgProps = {
  width: '18',
  height: '18',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
}

const IconGithub = () => (
  <svg {...svgProps}>
    <path d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z' />
  </svg>
)

const IconX = () => (
  <svg {...svgProps}>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
)

const IconWork = () => (
  <svg {...svgProps}>
    <path d='M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z' />
  </svg>
)

const IconSchool = () => (
  <svg {...svgProps}>
    <path d='M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z' />
  </svg>
)

const IconSecurity = () => (
  <svg {...svgProps}>
    <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z' />
  </svg>
)

const IconCode = () => (
  <svg {...svgProps}>
    <path d='M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z' />
  </svg>
)

const IconBook = () => (
  <svg {...svgProps}>
    <path d='M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z' />
  </svg>
)

const IconFlight = () => (
  <svg {...svgProps}>
    <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z' />
  </svg>
)

const IconVerified = () => (
  <svg {...svgProps}>
    <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' />
  </svg>
)

const IconLinux = () => (
  <svg {...svgProps} viewBox='0 0 24 24'>
    <path d='M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 0 0-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.066-.188-.135a.357.357 0 0 0-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 0 1-.004-.021l-.004-.024a1.807 1.807 0 0 1-.15.706.953.953 0 0 1-.213.335.71.71 0 0 0-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 0 1-.22-.253 1.778 1.778 0 0 1-.155-.247c-.043-.09-.064-.18-.064-.27 0-.166.055-.348.164-.544.04-.09.11-.175.164-.26a.273.273 0 0 0-.012-.035.834.834 0 0 0-.138-.187.375.375 0 0 1-.073-.039l-.013-.01zm-2.34.91c.154 0 .32.1.465.272.145.135.268.332.346.554.078.217.121.435.137.642l.002.024v.02a1.658 1.658 0 0 1-.023.24v.024a1.2 1.2 0 0 1-.07.27 1.04 1.04 0 0 1-.146.3c-.067.087-.145.165-.23.233a1.794 1.794 0 0 1-.3-.06 1.088 1.088 0 0 1-.296-.135 1.015 1.015 0 0 1-.24-.2.877.877 0 0 1-.16-.266c-.04-.1-.06-.21-.06-.326 0-.174.03-.363.092-.545.038-.135.092-.254.164-.36a.882.882 0 0 1 .24-.272.37.37 0 0 1 .08-.043z' />
  </svg>
)

const IconAws = () => (
  <svg {...svgProps} viewBox='0 0 24 24'>
    <path d='M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.374 6.18 6.18 0 0 1-.248-.47c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.863.279a2.065 2.065 0 0 1-.248.104.39.39 0 0 1-.128.024c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.128 0 .2.064.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.216-.151-.24-.223a.535.535 0 0 1-.04-.2v-.391c0-.168.064-.248.176-.248.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.336-.479.575-.654.24-.184.51-.32.83-.415a3.61 3.61 0 0 1 1.022-.144c.18 0 .367.008.559.032.2.024.383.056.567.096.175.048.343.096.502.152.16.056.28.112.359.168a.71.71 0 0 1 .232.2.454.454 0 0 1 .064.264v.367c0 .168-.064.256-.176.256a.805.805 0 0 1-.287-.096 3.48 3.48 0 0 0-1.461-.32c-.455 0-.815.072-1.062.224-.248.152-.375.383-.375.694 0 .217.08.4.24.552.16.152.454.304.87.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926a2.146 2.146 0 0 1-.566.703c-.24.2-.527.343-.862.44a3.702 3.702 0 0 1-1.093.16zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.319-.79 1.03-2.57.695-2.994z' />
  </svg>
)

const IconCloud = () => (
  <svg {...svgProps} viewBox='0 0 24 24'>
    <path d='M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c-3.01.15-5.394 2.658-5.394 5.727 0 3.17 2.572 5.742 5.742 5.742H19.31c2.586 0 4.69-2.103 4.69-4.69 0-2.46-1.9-4.48-4.313-4.669a9.358 9.358 0 0 0-7.487-8.003zm0 1.5a7.858 7.858 0 0 1 6.236 6.78l.097.657.663.033c1.755.088 3.123 1.533 3.123 3.292a3.191 3.191 0 0 1-3.19 3.19H3.304a4.244 4.244 0 0 1-4.242-4.242 4.243 4.243 0 0 1 4.05-4.233l.59-.03.109-.58a7.86 7.86 0 0 1 8.37-5.867z' />
  </svg>
)

/* ── Hero Section ── */
const heroCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem 2rem;
`

const avatarWrapperCss = css`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const avatarCss = css`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--c-border);
  box-shadow: 0 8px 30px var(--c-shadow-lg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 40px var(--c-shadow-lg);
  }
`

const spinText = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const rotatingTextCss = css`
  position: absolute;
  inset: 0;
  animation: ${spinText} 12s linear infinite;
`

const RotatingText = () => {
  const text =
    'Hello こんにちは 안녕하세요 你好 Bonjour Hola Ciao नमस्ते مرحبا Привет'
  const r = 90
  return (
    <svg class={rotatingTextCss} viewBox='0 0 200 200' width='200' height='200'>
      <defs>
        <path
          id='circlePath'
          d={`M 100,100 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
          fill='none'
        />
      </defs>
      <text
        font-size='13'
        font-weight='600'
        letter-spacing='2.5'
        fill='#16a34a'
        font-family="'SF Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace"
      >
        <textPath href='#circlePath'>{text}</textPath>
      </text>
    </svg>
  )
}

const heroNameCss = css`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${gray};
  margin: 1.2rem 0 0.3rem;
  letter-spacing: 0.01em;
`

const heroRoleCss = css`
  font-size: 0.95rem;
  color: var(--c-text-muted);
  margin: 0 0 1rem;
  font-weight: 400;
`

const socialRowCss = css`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;

  & a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--c-social-bg);
    color: var(--c-social-text);
    transition: all 0.25s ease;
    text-decoration: none;

    &:hover {
      background: var(--c-accent);
      color: var(--c-bg);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
    }
  }
`

/* ── Section Heading ── */
const sectionHeadingCss = css`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${gray};
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--c-section-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

/* ── Card ── */
const cardCss = css`
  background: var(--c-card-bg);
  border: 1px solid var(--c-card-border);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px var(--c-shadow);
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: 0 6px 24px var(--c-shadow-lg);
    transform: translateY(-2px);
  }
`

/* ── About Text ── */
const aboutTextCss = css`
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--c-text-muted);

  & p {
    margin: 0 0 1rem;
  }
`

const infoGridCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const infoItemCss = css`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--c-bg-info);
  border-radius: 10px;
  border: 1px solid var(--c-border);
`

const infoIconBoxCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(45, 212, 191, 0.15);
  color: var(--c-accent);
  flex-shrink: 0;
`

const infoContentCss = css`
  & strong {
    display: block;
    font-size: 0.8rem;
    color: var(--c-text-faint);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.15rem;
  }
  & span {
    font-size: 0.92rem;
    color: ${gray};
  }
`

/* ── Qualifications ── */
const qualListCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const qualItemCss = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  background: var(--c-bg-info);
  border-radius: 10px;
  border: 1px solid var(--c-border);
  transition: all 0.2s ease;

  &:hover {
    background: var(--c-hover-bg);
    border-color: var(--c-hover-border);
  }
`

const qualIconBase = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
`

const qualIconBlueCss = css`
  ${qualIconBase}
  background: rgba(45, 212, 191, 0.15);
  color: var(--c-accent);
`

const qualIconGreenCss = css`
  ${qualIconBase}
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
`

const qualIconOrangeCss = css`
  ${qualIconBase}
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
`

const qualTextCss = css`
  font-size: 0.92rem;
  color: ${gray};
  font-weight: 500;
`

export const title = 'about'

export default function About() {
  return (
    <Fragment>
      {/* Hero */}
      <div class={heroCss}>
        <div class={avatarWrapperCss}>
          <RotatingText />
          <img
            src='https://github.com/kn1515.png'
            alt='Profile'
            class={avatarCss}
          />
        </div>
        <h1 class={heroNameCss}>ぽん</h1>
        <p class={heroRoleCss}>
          Software Engineer &mdash; Frontend &amp; Backend
        </p>
        <div class={socialRowCss}>
          <a
            href='https://github.com/kn1515'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'
          >
            <IconGithub />
          </a>
          <a
            href='https://twitter.com/Non_c5c'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='X (Twitter)'
          >
            <IconX />
          </a>
        </div>
      </div>

      {/* About Me */}
      <h2 class={sectionHeadingCss}>
        <IconWork />
        About Me
      </h2>
      <div class={cardCss}>
        <div class={aboutTextCss}>
          <p>
            こんにちは！ぽんと申します。
            <br />
            システムエンジニアとして働いております。
            <br />
          </p>
          <p>
            関西にある大学の文系学部を卒業したのち、
            2019年より某SIerで働いています。
          </p>
          <p>
            バックエンドやインフラに関連する仕事をしたり、チームリーダーとしてプロジェクトを管理したりしています。
            セキュリティやOS、低レイヤの技術に特に興味があります。
          </p>
          <p>
            このブログでは、技術的なトピックや日常の出来事について書いています。ぜひご覧ください！
          </p>
          <br />
        </div>
        <div class={infoGridCss}>
          <div class={infoItemCss}>
            <div class={infoIconBoxCss}>
              <IconSecurity />
            </div>
            <div class={infoContentCss}>
              <strong>Interests</strong>
              <span>Security / OS / 低レイヤ</span>
            </div>
          </div>
          <div class={infoItemCss}>
            <div class={infoIconBoxCss}>
              <IconCode />
            </div>
            <div class={infoContentCss}>
              <strong>Hobbies</strong>
              <span>プログラミング / ゲーム / ごはん</span>
            </div>
          </div>
          <div class={infoItemCss}>
            <div class={infoIconBoxCss}>
              <IconBook />
            </div>
            <div class={infoContentCss}>
              <strong>Reading</strong>
              <span>読書</span>
            </div>
          </div>
          <div class={infoItemCss}>
            <div class={infoIconBoxCss}>
              <IconFlight />
            </div>
            <div class={infoContentCss}>
              <strong>Travel</strong>
              <span>旅行</span>
            </div>
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <h2 class={sectionHeadingCss}>
        <IconSchool />
        所持資格
      </h2>
      <div class={cardCss}>
        <div class={qualListCss}>
          <div class={qualItemCss}>
            <div class={qualIconBlueCss}>
              <IconVerified />
            </div>
            <span class={qualTextCss}>ITパスポート</span>
          </div>
          <div class={qualItemCss}>
            <div class={qualIconBlueCss}>
              <IconVerified />
            </div>
            <span class={qualTextCss}>基本情報技術者</span>
          </div>
          <div class={qualItemCss}>
            <div class={qualIconBlueCss}>
              <IconVerified />
            </div>
            <span class={qualTextCss}>応用情報技術者</span>
          </div>
          <div class={qualItemCss}>
            <div class={qualIconGreenCss}>
              <IconSecurity />
            </div>
            <span class={qualTextCss}>情報処理安全確保支援士 (合格)</span>
          </div>
          <div class={qualItemCss}>
            <div class={qualIconOrangeCss}>
              <IconLinux />
            </div>
            <span class={qualTextCss}>LPIC-1</span>
          </div>
          <div class={qualItemCss}>
            <div class={qualIconOrangeCss}>
              <IconAws />
            </div>
            <span class={qualTextCss}>
              AWS Certified Solutions Architect - Associate
            </span>
          </div>
          <div class={qualItemCss}>
            <div class={qualIconBlueCss}>
              <IconCloud />
            </div>
            <span class={qualTextCss}>
              Google Cloud Associate Cloud Engineer
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
