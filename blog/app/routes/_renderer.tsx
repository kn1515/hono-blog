import { Style, css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

const bodyCss = css`
  color: #1e2126;
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Segoe UI",
    "Roboto", "Noto Sans CJK JP", sans-serif, "Apple Color Emoji", "Segoe UI",
    "Emoji,Segoe UI", Symbol, "Noto Sans Emoji";
`

const titleCss = css``

const mainCss = css`
  margin: 0 auto;
  max-width: 800px;
`

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang='ja'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{title}</title>

        {/* TODO */}
        <meta name='description' content='TODO' />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='{{ if .IsPage }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}'
        />
        <meta
          property='og:image'
          content='https://blog.p1ass.com/images/ogp.png'
        />
        <meta
          property='og:url'
          content='https://blog.p1ass.com{{ .Permalink }}'
        />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@p1ass' />
        <meta name='twitter:creator' content='@p1ass' />
        <meta property='og:title' content='{{ .Title }}' />

        <script
          src='https://kit.fontawesome.com/ea66b8338f.js'
          crossorigin='anonymous'
          async
        />

        <link rel='icon' sizes='48x48' href='TOOD' />
        <link rel='apple-touch-icon' sizes='180x180' href='TODO' />
        <link
          href='TODO'
          rel='alternate'
          type='application/rss+xml'
          title='TODO'
        />

        {/* TODO: Google Absence / Analytics */}

        <Script src='/app/client.ts' async />
        <Style />
      </head>
      <body class={bodyCss}>
        <nav>
          <h2 class={titleCss}>ぷらすのブログ</h2>
          <ul>
            <li>Categories</li>
            <li>Tags</li>
            <li>RSS</li>
            <li>Portfolio</li>
            <li>GitHub</li>
            <li>Twitter</li>
          </ul>
        </nav>
        <main class={mainCss}>{children}</main>
      </body>
    </html>
  )
})
