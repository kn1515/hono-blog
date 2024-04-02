import { Style, css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { backgroundDark, border, gray } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

const bodyCss = css`
  color: ${gray};
  font-size: 16px;
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Segoe UI",
    "Roboto", "Noto Sans CJK JP", sans-serif, "Apple Color Emoji", "Segoe UI",
    "Emoji,Segoe UI", Symbol, "Noto Sans Emoji";

  margin: 0 1rem;
  padding: 0;

  * {
    line-height: 1.7rem;
  }

  h1 {
    line-height: 3.4rem;
}

h2 {
    line-height: 2.55rem;
    font-size: 1.75rem
}

h3 {
font-size: 1.3rem;
line-height: 2.55rem;
border-bottom: 1px solid #dde0e4;
}

p {
  margin: 0 0 1.7rem;
  line-height: 2.125rem;
}

code {
  background-color: ${backgroundDark};
  border: 1px solid ${border};
  border-radius: ${verticalRhythmUnit * 0.125}rem;
  font-family: monospace;
  font-size: 85%;
  padding: ${verticalRhythmUnit * 0.125}rem 0.5em;
}
`

const mainCss = css`
  margin: 0 auto;
  max-width: 800px;
`

export default jsxRenderer(({ children, title: propsTitle, frontmatter }) => {
  const description =
    frontmatter?.description ||
    'Webエンジニアリングについて学んだことや考えたことをまとめるブログです'

  const title = propsTitle ? `${propsTitle} - ぷらすのブログ` : 'ぷらすのブログ'
  return (
    <html lang='ja'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{title}</title>

        {/* TODO */}
        <meta name='description' content={description} />
        <meta property='og:type' content='website' />
        <meta property='og:description' content={description} />
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
        <meta property='og:title' content={title} />

        <script
          src='https://kit.fontawesome.com/ea66b8338f.js'
          crossorigin='anonymous'
          async
        />
        <script
          async
          src='https://platform.twitter.com/widgets.js'
          charset='utf-8'
        />

        <link rel='icon' sizes='48x48' href='/static/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/static/apple-touch-icon.png'
        />
        <link
          href='/index.xml'
          rel='alternate'
          type='application/rss+xml'
          title='TODO'
        />

        {/* TODO: Google Absence / Analytics */}

        <Script src='/app/client.ts' async />
        <Style />
      </head>
      <body class={bodyCss}>
        <Header />
        <main class={mainCss}>{children}</main>
        <Footer />
      </body>
    </html>
  )
})
