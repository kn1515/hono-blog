import { createRoute } from 'honox/factory'

export default createRoute(c => {
  const robotsTxt = `User-Agent: *
Allow: /

Sitemap: https://www.ponnlog.com/sitemap.xml`
  return c.text(robotsTxt, 200, {})
})
