import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import type { MDXComponents } from 'mdx/types'
import { BlockLink } from '../components/markdown/BlockLink'
import { Note } from '../components/markdown/Note'
import { StyledPre } from '../components/markdown/StyledPre'
import {
  Bold,
  Marker,
  TextColor,
  Underline,
} from '../components/markdown/TextStyles'
import { Toc } from '../components/markdown/Toc'
import { Twitter } from '../components/markdown/Twitter'
import { backgroundDark, blue, border, grayLight } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

export function useMDXComponents(): MDXComponents {
  const components = {
    img: Image,
    pre: StyledPre,
    blockquote: BlockQuote,
    a: Link,
    em: Em,
    h2: H2,
    h3: H3,
    table: Table,
    th: Th,
    td: Td,
    // ExLinkCard: ExLinkCard, //FIXME
    BlockLink: BlockLink,
    Note: Note,
    Twitter: Twitter,
    Toc: Toc,
    Marker: Marker,
    Bold: Bold,
    Underline: Underline,
    TextColor: TextColor,
  }
  // @ts-expect-error
  return components
}

const imageCss = css`
  display: block;
  max-height: 500px;
  max-width: 100%;
  margin: 0;
  border: 1px solid ${border};
`

export function Image(props: PropsWithChildren<Hono.ImgHTMLAttributes>) {
  // 本番ビルドではviteStaticCopyによって画像がコピーされているので、それに合わせたパスになるようにしている
  const src = import.meta.env.PROD
    ? props.src?.replaceAll('/app/routes', '')
    : props.src

  return (
    <a href={src}>
      <img src={src} alt={props.alt} class={imageCss} />
    </a>
  )
}

const blockQuoteCss = css`
  border-left: 0.25rem solid ${border};
  color: ${grayLight};
  margin: 0.8rem 0;
  padding: 0.5rem 1rem;

  p:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 600px) {
    padding: 0 5rem 0 1.25rem;
  }
`

function BlockQuote(props: PropsWithChildren<Hono.BlockquoteHTMLAttributes>) {
  return (
    <blockquote class={blockQuoteCss} cite={props.cite}>
      {props.children}
    </blockquote>
  )
}

const linkCss = css`
  color: ${blue};
`

function Link(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <a href={props.href} class={linkCss}>
      {props.children}
    </a>
  )
}

const emCss = css`
  color: ${grayLight};
  display: block;
  font-family: sans-serif;
  font-size: 0.9rem;
  font-style: normal;
  text-align: center;
`

function Em(props: PropsWithChildren<Hono.HTMLAttributes>) {
  return <em class={emCss}>{props.children}</em>
}

const tableCss = css`
  border-spacing: 0;
  border-collapse: collapse;

  & tr:nth-child(odd) td {
    background: ${backgroundDark};
  }
`

function Table(props: PropsWithChildren<Hono.TableHTMLAttributes>) {
  return (
    <table class={tableCss} align={props.align}>
      {props.children}
    </table>
  )
}

const thTdCss = css`
  border: solid 1px ${border};
  padding: ${verticalRhythmUnit * 0.25}rem ${verticalRhythmUnit * 0.5}rem;
`

function Th(props: PropsWithChildren<Hono.ThHTMLAttributes>) {
  return (
    <th class={thTdCss} align={props.align}>
      {props.children}
    </th>
  )
}

function Td(props: PropsWithChildren<Hono.TdHTMLAttributes>) {
  return (
    <td class={thTdCss} align={props.align}>
      {props.children}
    </td>
  )
}

/* ── Styled Headings ── */
const h2Css = css`
  position: relative;
  font-size: 1.55rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem;
  padding: 0.55rem 0 0.55rem 1rem;
  line-height: 1.5;
  border-bottom: 2px solid var(--c-border);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--c-accent, #2dd4bf);
    border-radius: 2px;
  }

  @media (max-width: 900px) {
    font-size: 1.35rem;
  }
`

const h3Css = css`
  position: relative;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2rem 0 0.75rem;
  padding: 0.35rem 0 0.35rem 0.9rem;
  line-height: 1.5;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.2em;
    bottom: 0.2em;
    width: 3px;
    background: var(--c-accent, #2dd4bf);
    border-radius: 2px;
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    font-size: 1.15rem;
  }
`

function H2(props: PropsWithChildren<Hono.HTMLAttributes>) {
  return (
    <h2 class={h2Css} id={props.id}>
      {props.children}
    </h2>
  )
}

function H3(props: PropsWithChildren<Hono.HTMLAttributes>) {
  return (
    <h3 class={h3Css} id={props.id}>
      {props.children}
    </h3>
  )
}
