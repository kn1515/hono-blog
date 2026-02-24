import { expect, test } from '@playwright/test'

test.describe('Left Sidebar Table of Contents', () => {
  test('should display the TOC container on post pages', async ({ page }) => {
    // blog-tech-stack has many headings
    await page.goto('/posts/blog-tech-stack/')
    const tocContainer = page.locator('#left-toc-container')
    await expect(tocContainer).toBeAttached()
  })

  test('should render TOC with "目次" title', async ({ page }) => {
    await page.goto('/posts/blog-tech-stack/')
    // Wait for the script to build the TOC
    await page.waitForSelector('#left-toc-title')
    const tocTitle = page.locator('#left-toc-title')
    await expect(tocTitle).toContainText('目次')
  })

  test('should render TOC items matching article headings', async ({
    page,
  }) => {
    await page.goto('/posts/blog-tech-stack/')
    await page.waitForSelector('#left-toc-list')
    const tocItems = page.locator('#left-toc-list li')
    const count = await tocItems.count()
    expect(count).toBeGreaterThan(0)

    // Each TOC item should have a link with an anchor href
    const firstLink = tocItems.first().locator('a')
    const href = await firstLink.getAttribute('href')
    expect(href).toMatch(/^#/)
  })

  test('should contain links to actual article headings', async ({ page }) => {
    await page.goto('/posts/blog-tech-stack/')
    await page.waitForSelector('#left-toc-list')

    // Get the first TOC link
    const firstTocLink = page.locator('#left-toc-list li a').first()
    const tocId = await firstTocLink.getAttribute('data-toc-id')
    expect(tocId).toBeTruthy()

    // Verify the corresponding heading exists in the article using evaluate
    const headingExists = await page.evaluate(
      id => !!document.querySelector(`article #${CSS.escape(id)}`),
      tocId!,
    )
    expect(headingExists).toBe(true)
  })

  test('should navigate to heading when TOC link is clicked', async ({
    page,
  }) => {
    await page.goto('/posts/blog-tech-stack/')
    await page.waitForSelector('#left-toc-list')

    const firstLink = page.locator('#left-toc-list li a').first()
    const _href = await firstLink.getAttribute('href')
    await firstLink.click()

    // URL should contain a hash fragment
    await expect(page).toHaveURL(/.*#.+/)
  })

  test('should distinguish h2 and h3 TOC items', async ({ page }) => {
    await page.goto('/posts/blog-tech-stack/')
    await page.waitForSelector('#left-toc-list')

    const h2Items = page.locator('#left-toc-list li.toc-h2')
    const h2Count = await h2Items.count()
    // blog-tech-stack has multiple h2 headings
    expect(h2Count).toBeGreaterThan(0)
  })
})
