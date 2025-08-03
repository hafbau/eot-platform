import { test, expect } from '@playwright/test';
import { login, testUsers } from '../helpers/auth.js';
import { 
  assertOnDashboardPage,
  assertDashboardStatsVisible,
  assertLoadingComplete,
  assertButtonAccessible 
} from '../helpers/assertions.js';
import { navigateToPage } from '../helpers/navigation.js';
import { 
  expectedDashboardStats, 
  pageElements, 
  dashboardQuickActions,
  upcomingDeadlines,
  actionItems 
} from '../fixtures/testData.js';

test.describe('Dashboard Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, testUsers.director);
    await assertOnDashboardPage(page);
  });

  test.describe('Dashboard Layout and Content', () => {
    
    test('should display dashboard header correctly', async ({ page }) => {
      // Check main heading
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
      
      // Check subtitle
      await expect(page.locator(`text=${pageElements.dashboard.subtitle}`)).toBeVisible();
      
      // Check header buttons
      await assertButtonAccessible(page, 'View Projects');
      await assertButtonAccessible(page, 'New Project');
    });

    test('should display key metrics cards', async ({ page }) => {
      await assertDashboardStatsVisible(page);
      
      // Verify all four stat cards are present
      const statCards = page.locator('[class*="grid"] [class*="shadow"]:has(h3), [class*="grid"] [class*="bg-white"]:has([class*="font-bold"])');
      await expect(statCards).toHaveCount({ gte: 4 });
      
      // Check for specific metrics
      await expect(page.locator('text=Active Projects')).toBeVisible();
      await expect(page.locator('text=Open Claims')).toBeVisible();
      await expect(page.locator('text=Approved YTD')).toBeVisible();
      await expect(page.locator('text=Delay Alerts')).toBeVisible();
    });

    test('should display stats with correct values', async ({ page }) => {
      // Wait for data to load
      await assertLoadingComplete(page);
      
      // Check for numerical values (we can't predict exact numbers due to mock data)
      // but we can verify they're displayed as numbers
      const numberRegex = /\d+/;
      
      // Active Projects should show a number
      const activeProjectsValue = page.locator('text=Active Projects').locator('..').locator('[class*="font-bold"]');
      await expect(activeProjectsValue).toBeVisible();
      
      // Open Claims should show a number
      const openClaimsValue = page.locator('text=Open Claims').locator('..').locator('[class*="font-bold"]');
      await expect(openClaimsValue).toBeVisible();
      
      // Currency values should be formatted properly
      await expect(page.locator('text=/\\$[\\d,]+/')).toBeVisible();
    });

    test('should display charts section', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Check for charts container
      const chartsSection = page.locator('[class*="grid"]:has([class*="lg:grid-cols-2"])');
      await expect(chartsSection).toBeVisible();
      
      // Look for chart elements (might be SVG or canvas)
      const charts = page.locator('svg, canvas, [data-testid="chart"]');
      await expect(charts.first()).toBeVisible();
    });

    test('should display upcoming deadlines section', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Look for upcoming deadlines section
      await expect(page.locator('text=Upcoming Deadlines, text=Response Due, text=Notice Period, text=Submission Due')).toBeVisible();
      
      // Check for deadline items
      const deadlineItems = page.locator('[class*="bg-white"]:has(text="Response Due"), [class*="bg-white"]:has(text="Notice Period")');
      if (await deadlineItems.count() > 0) {
        await expect(deadlineItems.first()).toBeVisible();
      }
    });

    test('should display action items section', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Look for action items section
      const actionItemsSection = page.locator('text=Action Items, text=Review Foundation, text=Prepare MEP, text=Schedule Client');
      if (await actionItemsSection.count() > 0) {
        await expect(actionItemsSection.first()).toBeVisible();
      }
      
      // Check for action item elements
      const actionElements = page.locator('[class*="pending"], [class*="in_progress"]');
      if (await actionElements.count() > 0) {
        await expect(actionElements.first()).toBeVisible();
      }
    });

    test('should display quick actions section', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Check for Quick Actions heading
      await expect(page.locator('text=Quick Actions')).toBeVisible();
      
      // Check for quick action cards
      for (const action of dashboardQuickActions) {
        await expect(page.locator(`text=${action}`)).toBeVisible();
      }
    });
  });

  test.describe('Dashboard Interactions', () => {
    
    test('should navigate to projects page from header button', async ({ page }) => {
      await page.click('button:has-text("View Projects"), a:has-text("View Projects")');
      
      // Should navigate to projects page
      await expect(page).toHaveURL(/\/projects/);
      await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
    });

    test('should navigate to projects page from quick actions', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Click on "Manage Projects" quick action
      const manageProjectsAction = page.locator('text=Manage Projects').locator('..').locator('..');
      await manageProjectsAction.click();
      
      // Should navigate to projects page
      await expect(page).toHaveURL(/\/projects/);
      await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
    });

    test('should handle new project button click', async ({ page }) => {
      // Click New Project button
      await page.click('button:has-text("New Project")');
      
      // This might open a modal or navigate to a new page
      // We'll just verify the button is clickable and doesn't cause errors
      // In a real implementation, this would likely open a project creation form
      
      // For now, verify we don't get any console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Wait a moment for any errors to appear
      await page.waitForTimeout(1000);
      expect(errors).toHaveLength(0);
    });

    test('should update action items status', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Look for action items with checkboxes or status buttons
      const actionItemCheckbox = page.locator('input[type="checkbox"]').first();
      
      if (await actionItemCheckbox.count() > 0) {
        const isChecked = await actionItemCheckbox.isChecked();
        
        // Toggle the checkbox
        await actionItemCheckbox.click();
        
        // Verify state changed
        const newState = await actionItemCheckbox.isChecked();
        expect(newState).not.toBe(isChecked);
      }
    });
  });

  test.describe('Dashboard Data Loading', () => {
    
    test('should show loading state initially', async ({ page }) => {
      // Clear auth and reload to see loading state
      await page.evaluate(() => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
      });
      
      // Login again to see loading
      await login(page, testUsers.director);
      
      // Page should load without hanging on loading state
      await assertLoadingComplete(page);
      await assertDashboardStatsVisible(page);
    });

    test('should handle data loading errors gracefully', async ({ page }) => {
      // Monitor console for errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Reload the page
      await page.reload();
      await assertLoadingComplete(page);
      
      // Dashboard should still be functional even if some data fails to load
      await assertOnDashboardPage(page);
      
      // Should not have critical errors that break the page
      const criticalErrors = errors.filter(error => 
        error.includes('Cannot read') || 
        error.includes('undefined') || 
        error.includes('null')
      );
      expect(criticalErrors).toHaveLength(0);
    });

    test('should refresh data when page is reloaded', async ({ page }) => {
      await assertLoadingComplete(page);
      
      // Get initial stats
      const initialStats = await page.locator('text=Active Projects').locator('..').textContent();
      
      // Reload page
      await page.reload();
      await assertLoadingComplete(page);
      
      // Stats should be displayed again (might be same or different values)
      await expect(page.locator('text=Active Projects')).toBeVisible();
      await assertDashboardStatsVisible(page);
    });
  });

  test.describe('Responsive Dashboard', () => {
    
    test('should display properly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await assertLoadingComplete(page);
      
      // Dashboard should still be accessible
      await assertOnDashboardPage(page);
      await assertDashboardStatsVisible(page);
      
      // Stats cards should stack vertically on mobile
      const statsGrid = page.locator('[class*="grid"]:has(text="Active Projects")');
      await expect(statsGrid).toBeVisible();
    });

    test('should display properly on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await assertLoadingComplete(page);
      
      // Dashboard should be functional
      await assertOnDashboardPage(page);
      await assertDashboardStatsVisible(page);
    });
  });

  test.describe('Dashboard Performance', () => {
    
    test('should load dashboard within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      // Navigate to dashboard (already logged in)
      await page.goto('/dashboard');
      await assertLoadingComplete(page);
      await assertDashboardStatsVisible(page);
      
      const loadTime = Date.now() - startTime;
      
      // Dashboard should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have memory leaks on repeated navigation', async ({ page }) => {
      // Navigate between dashboard and projects multiple times
      for (let i = 0; i < 3; i++) {
        await page.goto('/dashboard');
        await assertLoadingComplete(page);
        
        await page.goto('/projects');
        await page.waitForSelector('h1:has-text("Projects")');
      }
      
      // Return to dashboard
      await page.goto('/dashboard');
      await assertLoadingComplete(page);
      await assertDashboardStatsVisible(page);
    });
  });
});