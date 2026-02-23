import { expect, test } from '@playwright/test'

test.describe('Frontend JS Interactions', () => {
  test.describe('List/Grid View Toggle', () => {
    test('should display grid view by default', async ({ page }) => {
      await page.goto('/')
      const gridView = page.locator('#post-grid-view')
      const listView = page.locator('#post-list-view')
      await expect(gridView).toBeVisible()
      await expect(listView).toBeHidden()
    })

    test('should have grid toggle active by default', async ({ page }) => {
      await page.goto('/')
      const gridBtn = page.locator('#view-toggle-grid')
      const listBtn = page.locator('#view-toggle-list')
      await expect(gridBtn).toHaveAttribute('data-active', 'true')
      await expect(listBtn).toHaveAttribute('data-active', 'false')
    })

    test('should switch to list view when list button is clicked', async ({
      page,
    }) => {
      await page.goto('/')
      const listBtn = page.locator('#view-toggle-list')
      await listBtn.click()

      const gridView = page.locator('#post-grid-view')
      const listView = page.locator('#post-list-view')
      await expect(listView).toBeVisible()
      await expect(gridView).toBeHidden()

      // data-active should be updated
      await expect(listBtn).toHaveAttribute('data-active', 'true')
      await expect(page.locator('#view-toggle-grid')).toHaveAttribute(
        'data-active',
        'false',
      )
    })

    test('should switch back to grid view when grid button is clicked', async ({
      page,
    }) => {
      await page.goto('/')
      // First switch to list
      await page.locator('#view-toggle-list').click()
      // Then switch back to grid
      await page.locator('#view-toggle-grid').click()

      const gridView = page.locator('#post-grid-view')
      const listView = page.locator('#post-list-view')
      await expect(gridView).toBeVisible()
      await expect(listView).toBeHidden()
    })

    test('should persist view mode in localStorage', async ({ page }) => {
      await page.goto('/')
      await page.locator('#view-toggle-list').click()

      // Check localStorage
      const savedMode = await page.evaluate(() =>
        localStorage.getItem('viewMode'),
      )
      expect(savedMode).toBe('list')

      // Switch to grid and check again
      await page.locator('#view-toggle-grid').click()
      const savedMode2 = await page.evaluate(() =>
        localStorage.getItem('viewMode'),
      )
      expect(savedMode2).toBe('grid')
    })

    test('should restore saved view mode on page reload', async ({ page }) => {
      await page.goto('/')
      // Switch to list view
      await page.locator('#view-toggle-list').click()
      await expect(page.locator('#post-list-view')).toBeVisible()

      // Reload the page
      await page.reload()

      // List view should still be active after reload
      await expect(page.locator('#post-list-view')).toBeVisible()
      await expect(page.locator('#post-grid-view')).toBeHidden()
    })

    test('should display posts in both list and grid views', async ({
      page,
    }) => {
      await page.goto('/')
      // Grid view: should have post links
      let postLinks = page.locator('#post-grid-view a[href*="/posts/"]')
      let count = await postLinks.count()
      expect(count).toBeGreaterThan(0)

      // Switch to list view
      await page.locator('#view-toggle-list').click()
      postLinks = page.locator('#post-list-view a[href*="/posts/"]')
      count = await postLinks.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Dark Mode Toggle', () => {
    test('should display the theme toggle button', async ({ page }) => {
      await page.goto('/')
      const themeToggle = page.locator('#theme-toggle')
      await expect(themeToggle).toBeVisible()
    })

    test('should toggle dark class on html element when clicked', async ({
      page,
    }) => {
      await page.goto('/')
      const html = page.locator('html')

      const initialHasDark = await html.evaluate(el =>
        el.classList.contains('dark'),
      )

      // Click theme toggle
      await page.locator('#theme-toggle').click()

      const afterHasDark = await html.evaluate(el =>
        el.classList.contains('dark'),
      )
      expect(afterHasDark).toBe(!initialHasDark)
    })

    test('should toggle back to original mode on double click', async ({
      page,
    }) => {
      await page.goto('/')
      const html = page.locator('html')

      const initialHasDark = await html.evaluate(el =>
        el.classList.contains('dark'),
      )

      // Click twice to toggle back
      await page.locator('#theme-toggle').click()
      await page.locator('#theme-toggle').click()

      const afterDoubleClick = await html.evaluate(el =>
        el.classList.contains('dark'),
      )
      expect(afterDoubleClick).toBe(initialHasDark)
    })

    test('should persist theme preference in localStorage', async ({
      page,
    }) => {
      await page.goto('/')
      // Clear localStorage first
      await page.evaluate(() => localStorage.removeItem('theme'))
      await page.reload()

      // Toggle to dark mode
      const initialHasDark = await page
        .locator('html')
        .evaluate(el => el.classList.contains('dark'))

      await page.locator('#theme-toggle').click()

      const savedTheme = await page.evaluate(() =>
        localStorage.getItem('theme'),
      )
      expect(savedTheme).toBe(initialHasDark ? 'light' : 'dark')
    })

    test('should restore saved theme on page reload', async ({ page }) => {
      await page.goto('/')
      // Set dark mode explicitly
      await page.evaluate(() => localStorage.setItem('theme', 'dark'))
      await page.reload()

      const hasDark = await page
        .locator('html')
        .evaluate(el => el.classList.contains('dark'))
      expect(hasDark).toBe(true)

      // Clean up: set back to light
      await page.evaluate(() => localStorage.setItem('theme', 'light'))
    })

    test('should apply different CSS variables in dark mode', async ({
      page,
    }) => {
      await page.goto('/')
      // Ensure light mode
      await page.evaluate(() => localStorage.setItem('theme', 'light'))
      await page.reload()

      const lightBg = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--c-bg')
          .trim(),
      )

      // Switch to dark mode
      await page.locator('#theme-toggle').click()

      const darkBg = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--c-bg')
          .trim(),
      )

      // Background color should be different between light and dark
      expect(lightBg).not.toBe(darkBg)

      // Clean up
      await page.evaluate(() => localStorage.setItem('theme', 'light'))
    })
  })

  test.describe('Share Dropdown', () => {
    let postUrl: string

    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage()
      await page.goto('/')
      const postLink = page.locator('a[href*="/posts/"]').first()
      postUrl = (await postLink.getAttribute('href')) ?? '/posts/'
      await page.close()
    })

    test('should open share dropdown on click', async ({ page }) => {
      await page.goto(postUrl)
      const toggle = page.locator('#share-dropdown-toggle')
      await toggle.click()

      const menu = page.locator('#share-dropdown-menu')
      await expect(menu).toBeVisible()
    })

    test('should display share options (X, Hatena, LINE, etc.)', async ({
      page,
    }) => {
      await page.goto(postUrl)
      await page.locator('#share-dropdown-toggle').click()

      const menu = page.locator('#share-dropdown-menu')
      // Check for share links/buttons
      await expect(menu.locator('a, button').first()).toBeVisible()
      const itemCount = await menu.locator('a, button').count()
      expect(itemCount).toBeGreaterThanOrEqual(3) // At least X, Hatena, LINE
    })

    test('should close share dropdown when clicking outside', async ({
      page,
    }) => {
      await page.goto(postUrl)
      await page.locator('#share-dropdown-toggle').click()

      const menu = page.locator('#share-dropdown-menu')
      await expect(menu).toBeVisible()

      // Click outside
      await page.locator('article').click()
      await expect(menu).toBeHidden()
    })

    test('should have correct share URLs with encoded parameters', async ({
      page,
    }) => {
      await page.goto(postUrl)
      await page.locator('#share-dropdown-toggle').click()

      // X/Twitter share link should have encoded URL
      const xLink = page.locator(
        '#share-dropdown-menu a[href*="twitter.com/intent"]',
      )
      const href = await xLink.getAttribute('href')
      expect(href).toContain('url=')
      expect(href).toContain('text=')
    })
  })

  test.describe('Search Modal', () => {
    test('should open search modal on button click', async ({ page }) => {
      await page.goto('/')
      await page.locator('#search-open-btn').click()

      const modal = page.locator('#search-modal')
      await expect(modal).toBeVisible()

      const input = page.locator('#search-input')
      await expect(input).toBeVisible()
    })

    test('should close search modal on Escape key', async ({ page }) => {
      await page.goto('/')
      await page.locator('#search-open-btn').click()

      const modal = page.locator('#search-modal')
      await expect(modal).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(modal).toBeHidden()
    })

    test('should close search modal on overlay click', async ({ page }) => {
      await page.goto('/')
      await page.locator('#search-open-btn').click()

      const modal = page.locator('#search-modal')
      await expect(modal).toBeVisible()

      // Click the overlay to close
      await page.locator('#search-overlay').click()
      await expect(modal).toBeHidden()
    })

    test('should focus search input when modal opens', async ({ page }) => {
      await page.goto('/')
      await page.locator('#search-open-btn').click()

      // Wait for focus to be set (setTimeout in the script)
      await page.waitForTimeout(100)

      const input = page.locator('#search-input')
      await expect(input).toBeFocused()
    })
  })

  test.describe('Header Accordion Menu', () => {
    test('should open accordion panel on click', async ({ page }) => {
      await page.goto('/')
      const summary = page.locator('header details summary')
      await summary.click()

      const panel = page.locator('header details .accordion-panel')
      await expect(panel).toBeVisible()
    })

    test('should close accordion when clicking outside', async ({ page }) => {
      await page.goto('/')
      const summary = page.locator('header details summary')
      await summary.click()

      const details = page.locator('header details')
      await expect(details).toHaveAttribute('open', '')

      // Click outside the accordion
      await page.locator('main').click()

      // Accordion should close (script removes open attribute)
      await expect(details).not.toHaveAttribute('open', '')
    })

    test('should display navigation links in accordion panel', async ({
      page,
    }) => {
      await page.goto('/')
      await page.locator('header details summary').click()

      const panel = page.locator('header details .accordion-panel')
      const links = panel.locator('a')
      const count = await links.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Mobile Bottom Bar Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
    })

    test('should scroll to top when top button is clicked', async ({
      page,
    }) => {
      await page.goto('/')
      // Scroll down first
      await page.evaluate(() => window.scrollTo(0, 500))
      await page.waitForTimeout(200)

      const topBtn = page.locator('#mobile-top-btn')
      const count = await topBtn.count()
      if (count > 0 && (await topBtn.isVisible())) {
        await topBtn.click()
        await page.waitForTimeout(500) // Wait for smooth scroll

        const scrollY = await page.evaluate(() => window.scrollY)
        expect(scrollY).toBeLessThan(100)
      }
    })

    test('should open category dropdown from mobile bottom bar', async ({
      page,
    }) => {
      await page.goto('/')
      const catBtn = page.locator('#mobile-category-btn')
      const count = await catBtn.count()
      if (count > 0 && (await catBtn.isVisible())) {
        await catBtn.click()
        await page.waitForTimeout(400) // Wait for animation

        const catDropdown = page.locator('#category-dropdown')
        const catOverlay = page.locator('#category-overlay')
        await expect(catDropdown).toBeVisible()
        await expect(catOverlay).toBeVisible()
      }
    })

    test('should close category dropdown when overlay is clicked', async ({
      page,
    }) => {
      await page.goto('/')
      const catBtn = page.locator('#mobile-category-btn')
      const count = await catBtn.count()
      if (count > 0 && (await catBtn.isVisible())) {
        await catBtn.click()
        await page.waitForTimeout(400)

        // Click overlay to close
        await page.locator('#category-overlay').click()
        await page.waitForTimeout(400)

        const catDropdown = page.locator('#category-dropdown')
        await expect(catDropdown).toBeHidden()
      }
    })

    test('should open sidebar drawer from mobile bottom bar', async ({
      page,
    }) => {
      await page.goto('/')
      const sidebarBtn = page.locator('#mobile-sidebar-btn')
      const count = await sidebarBtn.count()
      if (count > 0 && (await sidebarBtn.isVisible())) {
        await sidebarBtn.click()
        await page.waitForTimeout(400) // Wait for animation

        const sidebarDrawer = page.locator('#sidebar-drawer')
        await expect(sidebarDrawer).toBeVisible()
      }
    })

    test('should close sidebar drawer when overlay is clicked', async ({
      page,
    }) => {
      await page.goto('/')
      const sidebarBtn = page.locator('#mobile-sidebar-btn')
      const count = await sidebarBtn.count()
      if (count > 0 && (await sidebarBtn.isVisible())) {
        await sidebarBtn.click()
        await page.waitForTimeout(400)

        // The overlay click triggers closeSidebar which removes 'is-open' class
        // and hides elements after 300ms timeout
        await page.locator('#sidebar-overlay').dispatchEvent('click')
        await page.waitForTimeout(500)

        const sidebarDrawer = page.locator('#sidebar-drawer')
        const hasIsOpen =
          await sidebarDrawer.evaluate(el =>
            el.classList.contains('is-open'),
          )
        expect(hasIsOpen).toBe(false)
      }
    })

    test('should open search from mobile search button', async ({ page }) => {
      await page.goto('/')
      const searchBtn = page.locator('#mobile-search-btn')
      const count = await searchBtn.count()
      if (count > 0 && (await searchBtn.isVisible())) {
        await searchBtn.click()
        const searchModal = page.locator('#search-modal')
        await expect(searchModal).toBeVisible()
      }
    })
  })
})
