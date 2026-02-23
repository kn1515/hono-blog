export type Frontmatter = {
  title: string
  date: string
  description: string
  categories: string[]
  tags?: string[]
  image?: string
  // ルートからのパス (ex. /posts/web-speed-hackathon-2024/ogp.jpg)
  ogImage?: string
  // ヒーローセクションにピン留めする場合 true
  pinned?: boolean
}
