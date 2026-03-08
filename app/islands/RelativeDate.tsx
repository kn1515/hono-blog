import { useEffect, useRef } from 'hono/jsx/dom'

/**
 * 指定日から現在までの相対的な経過時間を日本語文字列で返す
 * クライアント側で実行されるため、常に最新の相対日時を表示する
 */
const getRelativeDate = (dateStr: string): string => {
  // frontmatter の日付形式 "YYYY-MM-DDTHH:mm:ss" は Asia/Tokyo 基準
  const date = new Date(`${dateStr}+09:00`)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears >= 1) return `${diffYears}年前`
  if (diffMonths >= 1) return `${diffMonths}ヶ月前`
  if (diffDays >= 1) return `${diffDays}日前`
  if (diffHours >= 1) return `${diffHours}時間前`
  if (diffMinutes >= 1) return `${diffMinutes}分前`
  return 'たった今'
}

export default function RelativeDate({ date }: { date: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.textContent = `(${getRelativeDate(date)})`
  }, [])

  return <span ref={ref} />
}
