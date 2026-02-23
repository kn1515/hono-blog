import { expect, test } from '@playwright/test'

test.describe('Header & Navigation', () => {
  test('should display the header on every page', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('should have the site title link that navigates to home', async ({
    page,
  }) => {
    await page.goto('/about/')
    const titleLink = page.locator('header a[href="/"]')
    await expect(titleLink).toBeVisible()
    await titleLink.click()
    await expect(page).toHaveURL('/')
  })

  test('should display navigation links in the header accordion', async ({
    page,
  }) => {
    await page.goto('/')
    // Open the accordion menu
    const accordion = page.locator('header details summary')
    await accordion.click()

    // Check for categories link
    const categoriesLink = page.locator('header a[href="/categories/"]')
    await expect(categoriesLink).toBeVisible()

    // Check for tags link
    const tagsLink = page.locator('header a[href="/tags/"]')
    await expect(tagsLink).toBeVisible()
  })

  test('should display social links (GitHub, X/Twitter) in accordion', async ({
    page,
  }) => {
    await page.goto('/')
    // Open the accordion menu
    const accordion = page.locator('header details summary')
    await accordion.click()

    const githubLink = page.locator('header a[href*="github.com"]')
    await expect(githubLink).toBeVisible()

    const xLink = page.locator('header a[href*="twitter.com"]')
    await expect(xLink).toBeVisible()
  })

  test('should display RSS feed link in the header accordion', async ({
    page,
  }) => {
    await page.goto('/')
    // Open the accordion menu
    const accordion = page.locator('header details summary')
    await accordion.click()

    const rssLink = page.locator('header a[href="/index.xml"]')
    await expect(rssLink).toBeVisible()
  })

  test('should display the theme toggle button', async ({ page }) => {
    await page.goto('/')
    const themeToggle = page.locator('#theme-toggle')
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle dark mode when theme button is clicked', async ({
    page,
  }) => {
    await page.goto('/')
    const html = page.locator('html')

    // Initially should not have dark class (or may have based on system preference)
    const initialHasDark = await html.evaluate(el =>
      el.classList.contains('dark'),
    )

    // Click theme toggle
    await page.locator('#theme-toggle').click()

    // After click, the dark class should be toggled
    const afterHasDark = await html.evaluate(el =>
      el.classList.contains('dark'),
    )
    expect(afterHasDark).toBe(!initialHasDark)
  })

  test('should display the search button', async ({ page }) => {
    await page.goto('/')
    const searchBtn = page.locator('#search-open-btn')
    await expect(searchBtn).toBeVisible()
  })

  test('should open search modal when search button is clicked', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()

    const searchModal = page.locator('#search-modal')
    await expect(searchModal).toBeVisible()

    const searchInput = page.locator('#search-input')
    await expect(searchInput).toBeVisible()
  })

  test('should close search modal when Escape is pressed', async ({ page }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()

    const searchModal = page.locator('#search-modal')
    await expect(searchModal).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(searchModal).toBeHidden()
  })

  test('should display search results when typing in search input', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()

    const searchInput = page.locator('#search-input')
    await searchInput.fill('ブログ')

    const searchResults = page.locator('#search-results')
    // Should show results or "not found" message
    await expect(searchResults).toBeVisible()
  })
})
