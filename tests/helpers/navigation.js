/**
 * Navigation helper functions for E2E tests
 * These functions help navigate through the application
 */

/**
 * Navigate to a specific page and wait for it to load
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} path - The path to navigate to
 * @param {string} expectedTitle - Expected page title or heading text
 */
export async function navigateToPage(page, path, expectedTitle) {
  await page.goto(path);
  if (expectedTitle) {
    await page.waitForSelector(`h1:has-text("${expectedTitle}"), h2:has-text("${expectedTitle}")`);
  }
}

/**
 * Navigate to project dashboard
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Project ID to navigate to
 */
export async function navigateToProject(page, projectId) {
  await page.goto(`/projects/${projectId}/dashboard`);
  await page.waitForSelector('h1, h2'); // Wait for any main heading to load
}

/**
 * Navigate to project claims page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Project ID
 */
export async function navigateToProjectClaims(page, projectId) {
  await page.goto(`/projects/${projectId}/claims`);
  await page.waitForSelector('h1:has-text("Claims Management")');
}

/**
 * Navigate to project schedule page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Project ID
 */
export async function navigateToProjectSchedule(page, projectId) {
  await page.goto(`/projects/${projectId}/schedule`);
  await page.waitForSelector('h1, h2'); // Wait for main heading
}

/**
 * Navigate to project delays page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Project ID
 */
export async function navigateToProjectDelays(page, projectId) {
  await page.goto(`/projects/${projectId}/delays`);
  await page.waitForSelector('h1, h2'); // Wait for main heading
}

/**
 * Navigate to project evidence page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Project ID
 */
export async function navigateToProjectEvidence(page, projectId) {
  await page.goto(`/projects/${projectId}/evidence`);
  await page.waitForSelector('h1, h2'); // Wait for main heading
}

/**
 * Navigate using sidebar navigation
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} linkText - Text of the navigation link to click
 */
export async function navigateViaSidebar(page, linkText) {
  // Look for navigation link in sidebar
  const navLink = page.locator(`nav a:has-text("${linkText}"), aside a:has-text("${linkText}"), [role="navigation"] a:has-text("${linkText}")`);
  await navLink.first().click();
  
  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate using breadcrumb navigation
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} breadcrumbText - Text of the breadcrumb to click
 */
export async function navigateViaBreadcrumb(page, breadcrumbText) {
  const breadcrumb = page.locator(`[aria-label="breadcrumb"] a:has-text("${breadcrumbText}"), nav[aria-label="breadcrumb"] a:has-text("${breadcrumbText}")`);
  await breadcrumb.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate back using browser back button
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function navigateBack(page) {
  await page.goBack();
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for page to finish loading
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
  // Wait for any loading spinners to disappear
  await page.waitForFunction(() => {
    const spinners = document.querySelectorAll('[class*="spin"], [class*="loading"], .animate-spin');
    return spinners.length === 0;
  }, { timeout: 10000 });
}

/**
 * Check if current page matches expected route
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} expectedPath - Expected URL path
 * @returns {Promise<boolean>} - True if on expected page
 */
export async function isOnPage(page, expectedPath) {
  const currentUrl = page.url();
  return currentUrl.includes(expectedPath);
}