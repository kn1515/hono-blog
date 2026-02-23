import { expect, test } from '@playwright/test'

test.describe('Code Block Copy Button', () => {
  test('should display copy buttons on code blocks in posts', async ({
    page,
  }) => {
    // Navigate to a post that has code blocks (nuttx-install has many)
    await page.goto('/posts/nuttx-install/')
    // Hover over a code block wrapper to reveal the copy button
    const codeWrapper = page.locator('.code-block-wrapper').first()
    await expect(codeWrapper).toBeVisible()
    await codeWrapper.hover()
    const copyBtn = codeWrapper.locator('.code-copy-btn')
    await expect(copyBtn).toBeVisible()
    await expect(copyBtn).toContainText('Copy')
  })

  test('should have a copy button for each code block', async ({ page }) => {
    await page.goto('/posts/nuttx-install/')
    const codeWrappers = page.locator('.code-block-wrapper')
    const wrapperCount = await codeWrappers.count()
    expect(wrapperCount).toBeGreaterThan(0)

    // Each wrapper should have a copy button
    for (let i = 0; i < Math.min(wrapperCount, 3); i++) {
      const btn = codeWrappers.nth(i).locator('.code-copy-btn')
      await expect(btn).toBeAttached()
    }
  })

  test('should change text to "Copied!" after clicking copy button', async ({
    page,
  }) => {
    await page.goto('/posts/nuttx-install/')
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-write'])

    const codeWrapper = page.locator('.code-block-wrapper').first()
    await codeWrapper.hover()
    const copyBtn = codeWrapper.locator('.code-copy-btn')
    await expect(copyBtn).toBeVisible()

    await copyBtn.click()
    await expect(copyBtn).toContainText('Copied!')
  })

  test('should revert button text back to "Copy" after a delay', async ({
    page,
  }) => {
    await page.goto('/posts/nuttx-install/')
    await page.context().grantPermissions(['clipboard-write'])

    const codeWrapper = page.locator('.code-block-wrapper').first()
    await codeWrapper.hover()
    const copyBtn = codeWrapper.locator('.code-copy-btn')
    await copyBtn.click()
    await expect(copyBtn).toContainText('Copied!')

    // Wait for the text to revert (1.5s timeout in script)
    await page.waitForTimeout(2000)
    await expect(copyBtn).toContainText('Copy')
  })
})
