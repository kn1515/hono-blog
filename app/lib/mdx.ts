import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeMermaid from 'rehype-mermaid'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { PluggableList } from 'unified'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm,
]

export const rehypePlugins: PluggableList = [
  rehypeSlug,
  rehypeHighlight,
  rehypeMdxCodeProps,
  rehypeMdxImportMedia,
  rehypeMermaid,
]
