import { expect, test } from '@playwright/test'

test.describe('Hero Section - Pinned Posts', () => {
  test('should display the hero section on the top page', async ({ page }) => {
    await page.goto('/')
    const heroTitle = page.locator('text=ぽんろぐ備忘録').first()
    await expect(heroTitle).toBeVisible()
  })

  test('should display the "ピックアップ" heading', async ({ page }) => {
    await page.goto('/')
    const pickupHeading = page.locator('text=ピックアップ')
    await expect(pickupHeading).toBeVisible()
  })

  test('should display pinned post cards with titles', async ({ page }) => {
    await page.goto('/')
    // Pinned section is in the hero area, look for PICK UP badge
    const pickupBadges = page.locator('text=PICK UP')
    const count = await pickupBadges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display dates on pinned post cards', async ({ page }) => {
    await page.goto('/')
    // Find the pinned section by looking for ピックアップ, then find time elements near it
    const pinnedSection = page.locator('section').first()
    const times = pinnedSection.locator('time')
    const count = await times.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to pinned post when card is clicked', async ({
    page,
  }) => {
    await page.goto('/')
    // Find pinned post links — they are in the section with ピックアップ
    const pinnedLinks = page
      .locator('a[href*="/posts/"]')
      .filter({ has: page.locator('text=PICK UP') })
    const count = await pinnedLinks.count()
    expect(count).toBeGreaterThan(0)

    const href = await pinnedLinks.first().getAttribute('href')
    expect(href).toBeTruthy()

    await pinnedLinks.first().click()
    await page.waitForURL(`**${href}`)
    const title = page.locator('h1')
    await expect(title).toBeVisible()
  })

  test('should display blog description in hero', async ({ page }) => {
    await page.goto('/')
    const desc = page.locator(
      'text=エンジニアリング・セキュリティ・低レイヤの学び',
    )
    await expect(desc).toBeVisible()
  })
})
