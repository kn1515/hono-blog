import { parse } from '@formkit/tempo'

export const parseDate = (str: string) => {
  return parse(str, 'YYYY-MM-DDTHH:mm:ss', 'Asia/Tokyo')
}

/**
 * 指定日から現在までの相対的な経過時間を日本語文字列で返す
 * 例: "3日前", "2ヶ月前", "1年前"
 */
export const getRelativeDate = (dateStr: string): string => {
  const date = parseDate(dateStr)
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
