import { expect, test } from '@playwright/test'

test.describe('Related Posts Section', () => {
  let postUrl: string

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await page.goto('/')
    const postLink = page.locator('a[href*="/posts/"]').first()
    const href = await postLink.getAttribute('href')
    postUrl = href ?? '/posts/'
    await page.close()
  })

  test('should display the related posts section on a post page', async ({
    page,
  }) => {
    await page.goto(postUrl)
    const section = page.locator('section:has(h2:text("関連記事"))')
    await expect(section).toBeVisible()
  })

  test('should display the "関連記事" heading', async ({ page }) => {
    await page.goto(postUrl)
    const heading = page.locator('h2', { hasText: '関連記事' })
    await expect(heading).toBeVisible()
  })

  test('should display up to 3 related post cards', async ({ page }) => {
    await page.goto(postUrl)
    const section = page.locator('section:has(h2:text("関連記事"))')
    const cards = section.locator('a[href*="/posts/"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(3)
  })

  test('should display a title for each related post card', async ({
    page,
  }) => {
    await page.goto(postUrl)
    const section = page.locator('section:has(h2:text("関連記事"))')
    const cards = section.locator('a[href*="/posts/"]')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const title = cards.nth(i).locator('p')
      await expect(title).toBeVisible()
      const text = await title.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })

  test('should display a date for each related post card', async ({ page }) => {
    await page.goto(postUrl)
    const section = page.locator('section:has(h2:text("関連記事"))')
    const cards = section.locator('a[href*="/posts/"]')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const time = cards.nth(i).locator('time')
      await expect(time).toBeVisible()
      const dateText = await time.textContent()
      expect(dateText).toMatch(/\d{4}\/\d{2}\/\d{2}/)
    }
  })

  test('should not link to the current post in related posts', async ({
    page,
  }) => {
    await page.goto(postUrl)
    const section = page.locator('section:has(h2:text("関連記事"))')
    const cards = section.locator('a[href*="/posts/"]')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const href = await cards.nth(i).getAttribute('href')
      // The related post link should not point to the current post
      expect(href).not.toBe(postUrl)
    }
  })

  test('should navigate to a related post when clicked', async ({ page }) => {
    await page.goto(postUrl)
    const section = page.locator('section:has(h2:text("関連記事"))')
    const firstCard = section.locator('a[href*="/posts/"]').first()
    const href = await firstCard.getAttribute('href')
    expect(href).toBeTruthy()

    await firstCard.click()
    await page.waitForURL(`**${href}`)
    const response = await page.goto(page.url())
    expect(response?.status()).toBe(200)
  })

  test('should display related posts before the giscus comment section', async ({
    page,
  }) => {
    await page.goto(postUrl)
    const relatedSection = page.locator('section:has(h2:text("関連記事"))')
    const giscus = page.locator('#giscus-container')

    const relatedBox = await relatedSection.boundingBox()
    const giscusBox = await giscus.boundingBox()

    // Related posts section should appear above the giscus container
    if (relatedBox && giscusBox) {
      expect(relatedBox.y).toBeLessThan(giscusBox.y)
    }
  })
})
