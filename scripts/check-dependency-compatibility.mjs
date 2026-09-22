import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { compile } from '@mdx-js/mdx'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

// Exercise the consumers of security overrides, including development-only APIs.
const transformed = viteCommonjs({ include: ['fixture'] }).transform(
  'module.exports = 42',
  '/node_modules/fixture/index.js',
)
assert.match(transformed.code, /export default/)

const mdx = await compile('+++\ntitle = "TOML compatibility"\n+++\n# Post', {
  remarkPlugins: [[remarkFrontmatter, ['toml']], remarkMdxFrontmatter],
})
assert.match(String(mdx), /TOML compatibility/)

const require = createRequire(import.meta.url)
const wranglerRequire = createRequire(require.resolve('wrangler/package.json'))
const miniflareRequire = createRequire(wranglerRequire.resolve('miniflare'))
const sharp = miniflareRequire('sharp')
const image = await sharp({
  create: { width: 4, height: 4, channels: 3, background: '#ffffff' },
})
  .resize(2, 2)
  .png()
  .toBuffer()
const metadata = await sharp(image).metadata()
assert.equal(metadata.width, 2)
assert.equal(metadata.height, 2)

const { Miniflare } = wranglerRequire('miniflare')
const worker = new Miniflare({
  modules: true,
  compatibilityDate: '2025-01-01',
  script: `export default {
    fetch(request) {
      if (new URL(request.url).pathname === '/ws') {
        const pair = new WebSocketPair()
        pair[1].accept()
        pair[1].addEventListener('message', event => pair[1].send(event.data))
        return new Response(null, { status: 101, webSocket: pair[0] })
      }
      return new Response('dependency compatibility')
    }
  }`,
})
try {
  const response = await worker.dispatchFetch('https://example.test/')
  assert.equal(await response.text(), 'dependency compatibility')
  const upgraded = await worker.dispatchFetch('https://example.test/ws', {
    headers: { Upgrade: 'websocket' },
  })
  assert.equal(upgraded.status, 101)
  const socket = upgraded.webSocket
  assert.ok(socket)
  socket.accept()
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('WebSocket timeout')),
      5000,
    )
    socket.addEventListener('message', event => {
      clearTimeout(timeout)
      try {
        assert.equal(event.data, 'hello')
        resolve()
      } catch (error) {
        reject(error)
      }
    })
    socket.send('hello')
  })
  socket.close()
} finally {
  await worker.dispose()
}

console.log('Dependency compatibility checks passed')
