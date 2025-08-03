/**
 * Custom assertion helpers for E2E tests
 * These functions provide common assertions for the EOT Intelligence Platform
 */

import { expect } from '@playwright/test';

/**
 * Assert that user is on the login page
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertOnLoginPage(page) {
  // Accept both /login and /signin as valid login URLs (migration changes)
  await expect(page).toHaveURL(/\/(login|signin)/);
  await expect(page.locator('h2:has-text("Sign in to your account")')).toBeVisible();
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
}

/**
 * Assert that user is on the dashboard page
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertOnDashboardPage(page) {
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  // Check for key dashboard elements
  await expect(page.locator('text=Active Projects')).toBeVisible();
  await expect(page.locator('text=Open Claims')).toBeVisible();
}

/**
 * Assert that user is on the projects page
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertOnProjectsPage(page) {
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
  await expect(page.locator('text=Manage and monitor all your construction projects')).toBeVisible();
}

/**
 * Assert that user is on a specific project page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Expected project ID
 * @param {string} section - Expected section (dashboard, claims, schedule, etc.)
 */
export async function assertOnProjectPage(page, projectId, section = 'dashboard') {
  const expectedUrl = new RegExp(`/projects/${projectId}/${section}`);
  await expect(page).toHaveURL(expectedUrl);
}

/**
 * Assert that user is on the claims page for a project
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectId - Expected project ID
 */
export async function assertOnClaimsPage(page, projectId) {
  await assertOnProjectPage(page, projectId, 'claims');
  await expect(page.locator('h1:has-text("Claims Management")')).toBeVisible();
  await expect(page.locator('text=Extension of Time (EOT) claims and submissions')).toBeVisible();
}

/**
 * Assert that a protected route redirects to login when not authenticated
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} protectedPath - The protected route to test
 */
export async function assertProtectedRouteRedirectsToLogin(page, protectedPath) {
  await page.goto(protectedPath);
  await assertOnLoginPage(page);
}

/**
 * Assert that stats cards are visible on dashboard
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertDashboardStatsVisible(page) {
  await expect(page.locator('text=Active Projects')).toBeVisible();
  await expect(page.locator('text=Open Claims')).toBeVisible();
  await expect(page.locator('text=Approved YTD')).toBeVisible();
  await expect(page.locator('text=Delay Alerts')).toBeVisible();
}

/**
 * Assert that project cards are visible in projects list
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} minExpected - Minimum number of project cards expected
 */
export async function assertProjectCardsVisible(page, minExpected = 1) {
  const projectCards = page.locator('[data-testid="project-card"], .bg-white.rounded-lg.shadow:has(h3)');
  await expect(projectCards).toHaveCount({ gte: minExpected });
}

/**
 * Assert that a specific project is visible in the projects list
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} projectName - Name of the project to look for
 */
export async function assertProjectVisible(page, projectName) {
  await expect(page.locator(`h3:has-text("${projectName}")`)).toBeVisible();
}

/**
 * Assert that claims list is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertClaimsListVisible(page) {
  await expect(page.locator('text=Total Claims')).toBeVisible();
  await expect(page.locator('text=Total Value')).toBeVisible();
  await expect(page.locator('text=Approved')).toBeVisible();
  await expect(page.locator('text=Pending')).toBeVisible();
}

/**
 * Assert that a specific claim is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} claimReference - Reference number of the claim
 */
export async function assertClaimVisible(page, claimReference) {
  await expect(page.locator(`text=${claimReference}`)).toBeVisible();
}

/**
 * Assert that search functionality works
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} searchTerm - Term to search for
 * @param {string} expectedResult - Text that should appear in results
 */
export async function assertSearchWorks(page, searchTerm, expectedResult) {
  const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
  await searchInput.fill(searchTerm);
  await page.waitForTimeout(500); // Wait for search to process
  await expect(page.locator(`text=${expectedResult}`)).toBeVisible();
}

/**
 * Assert that filter functionality works
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} filterValue - Value to filter by
 * @param {string} expectedResult - Text that should appear after filtering
 */
export async function assertFilterWorks(page, filterValue, expectedResult) {
  const filterSelect = page.locator('select[class*="border"], select');
  await filterSelect.selectOption(filterValue);
  await page.waitForTimeout(500); // Wait for filter to process
  await expect(page.locator(`text=${expectedResult}`)).toBeVisible();
}

/**
 * Assert that navigation menu/sidebar is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertNavigationVisible(page) {
  // Look for common navigation elements
  const nav = page.locator('nav, aside, [role="navigation"]');
  await expect(nav.first()).toBeVisible();
}

/**
 * Assert that user can access a button or link
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} buttonText - Text of the button/link
 */
export async function assertButtonAccessible(page, buttonText) {
  const button = page.locator(`button:has-text("${buttonText}"), a:has-text("${buttonText}")`);
  await expect(button.first()).toBeVisible();
  await expect(button.first()).toBeEnabled();
}

/**
 * Assert that error message is displayed
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} errorMessage - Expected error message
 */
export async function assertErrorMessageVisible(page, errorMessage) {
  // Try multiple selectors to find the error message
  const errorSelectors = [
    `text=${errorMessage}`,
    `p:has-text("${errorMessage}")`,
    `.text-red-600:has-text("${errorMessage}")`,
    `.error:has-text("${errorMessage}")`,
    `[role="alert"]:has-text("${errorMessage}")`
  ];
  
  let found = false;
  for (const selector of errorSelectors) {
    try {
      await expect(page.locator(selector)).toBeVisible({ timeout: 1000 });
      found = true;
      break;
    } catch (e) {
      // Try next selector
    }
  }
  
  if (!found) {
    // Take a screenshot to debug
    console.log('Available text content:', await page.textContent('body'));
    throw new Error(`Error message "${errorMessage}" not found with any selector`);
  }
}

/**
 * Assert that loading state is handled properly
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertLoadingComplete(page) {
  // Wait for loading spinners to disappear
  await page.waitForFunction(() => {
    const spinners = document.querySelectorAll('[class*="spin"], [class*="loading"], .animate-spin');
    return spinners.length === 0;
  }, { timeout: 10000 });
}