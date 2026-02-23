import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'

/* ── Marker (蛍光ペン風ハイライト) ── */
const markerYellowCss = css`
  background: linear-gradient(transparent 60%, #fef08a 60%);
  padding: 0 2px;
`
const markerPinkCss = css`
  background: linear-gradient(transparent 60%, #fecdd3 60%);
  padding: 0 2px;
`
const markerGreenCss = css`
  background: linear-gradient(transparent 60%, #bbf7d0 60%);
  padding: 0 2px;
`
const markerBlueCss = css`
  background: linear-gradient(transparent 60%, #bfdbfe 60%);
  padding: 0 2px;
`

const markerMap = {
  yellow: markerYellowCss,
  pink: markerPinkCss,
  green: markerGreenCss,
  blue: markerBlueCss,
} as const

type MarkerProps = PropsWithChildren<{
  color?: 'yellow' | 'pink' | 'green' | 'blue'
}>

/**
 * 蛍光ペン風のマーカー
 * `<Marker>テキスト</Marker>` or `<Marker color="pink">テキスト</Marker>`
 */
export function Marker({ children, color = 'yellow' }: MarkerProps) {
  return <span class={markerMap[color] || markerYellowCss}>{children}</span>
}

/* ── Bold（太字 + 色付き） ── */
type BoldProps = PropsWithChildren<{
  color?: string
}>

/**
 * 太字＋色付きテキスト
 * `<Bold>テキスト</Bold>` or `<Bold color="red">テキスト</Bold>`
 */
export function Bold({ children, color }: BoldProps) {
  const style = color ? `font-weight:700;color:${color}` : 'font-weight:700'
  return <strong style={style}>{children}</strong>
}

/* ── Underline（下線＋色指定可） ── */
const underlineDefaultCss = css`
  text-decoration: underline;
  text-decoration-color: var(--c-accent);
  text-underline-offset: 3px;
  text-decoration-thickness: 2px;
`

type UnderlineProps = PropsWithChildren<{
  color?: string
}>

/**
 * 下線テキスト
 * `<Underline>テキスト</Underline>` or `<Underline color="red">テキスト</Underline>`
 */
export function Underline({ children, color }: UnderlineProps) {
  if (color) {
    return (
      <span
        style={`text-decoration:underline;text-decoration-color:${color};text-underline-offset:3px;text-decoration-thickness:2px`}
      >
        {children}
      </span>
    )
  }
  return <span class={underlineDefaultCss}>{children}</span>
}

/* ── TextColor（文字色指定） ── */
type TextColorProps = PropsWithChildren<{
  color?: string
}>

/**
 * 文字色を変更
 * `<TextColor color="red">テキスト</TextColor>`
 */
export function TextColor({
  children,
  color = 'var(--c-accent)',
}: TextColorProps) {
  return <span style={`color:${color}`}>{children}</span>
}
