import { useEffect, useRef } from 'hono/jsx/dom'

/**
 * giscus configuration
 *
 * Before using this component, the repository owner must:
 * 1. Enable GitHub Discussions on the repository (Settings > General > Features > Discussions)
 * 2. Install the giscus GitHub App: https://github.com/apps/giscus
 * 3. Create a "Comments" category in Discussions (or use an existing one)
 * 4. Update GISCUS_CATEGORY_ID below with the correct value from https://giscus.app
 */
const GISCUS_REPO = 'kn1515/hono-blog'
const GISCUS_REPO_ID = 'R_kgDONGoI-A'
// TODO: Update this after enabling Discussions and creating a "Comments" category
// Visit https://giscus.app to get the correct category ID
const GISCUS_CATEGORY = 'Comments'
const GISCUS_CATEGORY_ID = ''

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Determine initial theme based on <html> class
    const isDark = document.documentElement.classList.contains('dark')
    const theme = isDark ? 'dark' : 'light'

    // Create and insert giscus script
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', GISCUS_REPO)
    script.setAttribute('data-repo-id', GISCUS_REPO_ID)
    script.setAttribute('data-category', GISCUS_CATEGORY)
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', theme)
    script.setAttribute('data-lang', 'ja')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true
    container.appendChild(script)

    // Observe theme changes on <html> to sync giscus theme
    const observer = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark')
      const newTheme = nowDark ? 'dark' : 'light'
      const iframe = container.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame',
      )
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: newTheme } } },
          'https://giscus.app',
        )
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
      // Clean up script and iframe on unmount
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return <div ref={containerRef} id='giscus-container' />
}
