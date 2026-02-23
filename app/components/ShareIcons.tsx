import { css } from 'hono/css'
import { verticalRhythmUnit } from '../styles/variables'

const shareIconsSectionCss = css`
  text-align: center;
  margin: ${verticalRhythmUnit}rem 0;
`

const shareIconWrapperCss = css`
  display: inline-block;
  text-align: left;
`

const shareButtonCss = css`
  float: left;
  border-radius: 100%;
  -moz-transition: all 280ms ease;
  -o-transition: all 280ms ease;
  -webkit-transition: all 280ms ease;
  transition: all 280ms ease;

  margin: 0 0 0 12px;

  &:hover {
    box-shadow: inset 0 0 0 22px var(--c-share-hover);
  }
`

const shareButtonLinkCss = css`
  display: table-cell;
  width: ${verticalRhythmUnit * 1.625}rem;
  height: ${verticalRhythmUnit * 1.625}rem;
  color: #a1a1aa;
  text-align: center;
  vertical-align: middle;
  -moz-transition: all 280ms ease;
  -o-transition: all 280ms ease;
  -webkit-transition: all 280ms ease;
  transition: all 280ms ease;
  text-decoration: none;

  & i {
    font-size: 22px;
    vertical-align: middle;
    padding-bottom: 1px;

    &:hover {
      box-shadow: none;
    }
  }
`

const xCss = css`
  ${shareButtonCss}
  background-color: black;

  &:hover {
    box-shadow: inset 0 0 0 22px var(--c-x-hover-bg);
    background-color: var(--c-x-hover-bg);
  }
`

const xShareButtonLinkCss = css`
  ${shareButtonLinkCss}

  & i {
    color: #ffffff;
  }
`

const xIconCss = css`
  &:before {
    content: "𝕏";
    font-family: Verdana;
    font-weight: bold;
    font-style: normal;
    font-size: 1.5rem;
  }
`

const hatenaCss = css`
  ${shareButtonCss}
  box-shadow: inset 0 0 0 0.1rem #4ba3d9;

  & i {
    color: #4ba3d9;
  }
`

const hatenaIconCss = css`
  &:before {
    content: "B!";
    font-family: Verdana;
    font-weight: bold;
    font-style: normal;
  }
`

const lineCss = css`
  ${shareButtonCss}
  background-color: #06c755;

  &:hover {
    box-shadow: inset 0 0 0 22px #05b34c;
    background-color: #05b34c;
  }
`

const lineShareIconCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`

const slackCss = css`
  ${shareButtonCss}
  background-color: #4a154b;

  &:hover {
    box-shadow: inset 0 0 0 22px #611f63;
    background-color: #611f63;
  }
`

const slackShareIconCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`

const discordCss = css`
  ${shareButtonCss}
  background-color: #5865f2;

  &:hover {
    box-shadow: inset 0 0 0 22px #4752c4;
    background-color: #4752c4;
  }
`

const discordShareIconCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`

type Props = {
  title: string
  permalink: string
}

export function ShareButtons({ title, permalink }: Props) {
  return (
    <section class={shareIconsSectionCss}>
      <div class={shareIconWrapperCss}>
        <div class={xCss}>
          <a
            href={`http://twitter.com/intent/tweet?url=https://www.ponnlog.com${permalink}&text=${title} - ぽんろぐ備忘録`}
            target='_blank'
            rel='noreferrer noopener'
            title='Post'
            class={xShareButtonLinkCss}
          >
            <i class={xIconCss} />
          </a>
        </div>
        <div class={hatenaCss}>
          <a
            href={`http://b.hatena.ne.jp/add?mode=confirm&url=https://www.ponnlog.com${permalink}&title=${title} - ぽんろぐ備忘録`}
            target='_blank'
            rel='noreferrer noopener'
            title='hatena'
            class={shareButtonLinkCss}
          >
            <i class={hatenaIconCss} />
          </a>
        </div>
        <div class={lineCss}>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://www.ponnlog.com${permalink}`)}`}
            target='_blank'
            rel='noreferrer noopener'
            title='LINE'
            class={shareButtonLinkCss}
          >
            <span class={lineShareIconCss}>
              <svg width='22' height='22' viewBox='0 0 24 24' fill='#fff'>
                <path d='M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314' />
              </svg>
            </span>
          </a>
        </div>
        <div class={slackCss}>
          <a
            href={`https://slack.com/`}
            target='_blank'
            rel='noreferrer noopener'
            title='Slack'
            class={shareButtonLinkCss}
            data-share-slack='true'
            data-url={`https://www.ponnlog.com${permalink}`}
            data-title={title}
          >
            <span class={slackShareIconCss}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='#fff'>
                <path d='M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.164 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.164 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.314A2.528 2.528 0 0 1 24 15.164a2.528 2.528 0 0 1-2.522 2.521h-6.314z' />
              </svg>
            </span>
          </a>
        </div>
        <div class={discordCss}>
          <a
            href={`https://discord.com/`}
            target='_blank'
            rel='noreferrer noopener'
            title='Discord'
            class={shareButtonLinkCss}
            data-share-discord='true'
            data-url={`https://www.ponnlog.com${permalink}`}
            data-title={title}
          >
            <span class={discordShareIconCss}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='#fff'>
                <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
