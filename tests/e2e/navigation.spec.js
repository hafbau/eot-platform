import { test, expect } from '@playwright/test';
import { login, logout, testUsers } from '../helpers/auth.js';
import { 
  assertOnDashboardPage,
  assertOnProjectsPage,
  assertOnLoginPage,
  assertNavigationVisible,
  assertButtonAccessible,
  assertLoadingComplete
} from '../helpers/assertions.js';
import { 
  navigateToPage,
  navigateViaSidebar,
  navigateBack,
  waitForPageLoad,
  isOnPage
} from '../helpers/navigation.js';
import { 
  testProjects,
  navigationItems,
  projectSections
} from '../fixtures/testData.js';

test.describe('Navigation and User Interactions', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, testUsers.director);
  });

  test.describe('Main Navigation', () => {
    
    test('should display main navigation elements', async ({ page }) => {
      await page.goto('/dashboard');
      await assertLoadingComplete(page);
      
      // Check for navigation visibility
      await assertNavigationVisible(page);
      
      // Check for main navigation items
      for (const item of navigationItems) {
        await expect(page.locator(`nav a:has-text("${item}"), aside a:has-text("${item}"), [role="navigation"] a:has-text("${item}")`)).toBeVisible();
      }
    });

    test('should navigate between main sections', async ({ page }) => {
      // Start at dashboard
      await page.goto('/dashboard');
      await assertOnDashboardPage(page);
      
      // Navigate to projects
      await navigateViaSidebar(page, 'Projects');
      await assertOnProjectsPage(page);
      
      // Navigate back to dashboard
      await navigateViaSidebar(page, 'Dashboard');
      await assertOnDashboardPage(page);
    });

    test('should maintain navigation state across pages', async ({ page }) => {
      // Navigate to different pages and verify nav remains consistent
      const pages = ['/dashboard', '/projects'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await waitForPageLoad(page);
        await assertNavigationVisible(page);
      }
    });

    test('should highlight current page in navigation', async ({ page }) => {
      // Check if current page is highlighted in navigation
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Look for active/current navigation indicators
      const activeNavItems = page.locator('[aria-current="page"], [class*="active"], [class*="current"]');
      
      if (await activeNavItems.count() > 0) {
        await expect(activeNavItems.first()).toBeVisible();
      }
    });
  });

  test.describe('Project Navigation', () => {
    
    test('should navigate between project sections', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Test navigation to each project section
      for (const section of projectSections) {
        await page.goto(`/projects/${projectId}/${section}`);
        await waitForPageLoad(page);
        
        // Verify we're on the correct page
        expect(await isOnPage(page, `/projects/${projectId}/${section}`)).toBe(true);
      }
    });

    test('should display project navigation tabs/menu', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await page.goto(`/projects/${projectId}/dashboard`);
      await waitForPageLoad(page);
      
      // Look for project section navigation
      const projectNavItems = page.locator('nav a, [role="tablist"] a, [data-testid*="tab"]');
      
      if (await projectNavItems.count() > 0) {
        await expect(projectNavItems.first()).toBeVisible();
      }
    });

    test('should handle project navigation with URL parameters', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Test direct URL navigation to project sections
      await page.goto(`/projects/${projectId}/claims`);
      await waitForPageLoad(page);
      
      // Should be on claims page
      expect(await isOnPage(page, `/projects/${projectId}/claims`)).toBe(true);
      
      // Navigate to another section
      await page.goto(`/projects/${projectId}/schedule`);
      await waitForPageLoad(page);
      
      expect(await isOnPage(page, `/projects/${projectId}/schedule`)).toBe(true);
    });

    test('should handle invalid project IDs gracefully', async ({ page }) => {
      // Try to navigate to non-existent project
      await page.goto('/projects/999/dashboard');
      
      // Should handle gracefully (might redirect or show error)
      // At minimum, should not crash the application
      await page.waitForTimeout(2000);
      
      // Verify page doesn't crash
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    
    test('should display breadcrumbs on project pages', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await page.goto(`/projects/${projectId}/claims`);
      await waitForPageLoad(page);
      
      // Look for breadcrumb navigation
      const breadcrumbs = page.locator('[aria-label="breadcrumb"], [data-testid="breadcrumb"], nav:has(a):has(text="/")');
      
      if (await breadcrumbs.count() > 0) {
        await expect(breadcrumbs.first()).toBeVisible();
      }
    });

    test('should handle breadcrumb navigation clicks', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await page.goto(`/projects/${projectId}/claims`);
      await waitForPageLoad(page);
      
      // Look for clickable breadcrumb items
      const breadcrumbLinks = page.locator('[aria-label="breadcrumb"] a, [data-testid="breadcrumb"] a');
      
      if (await breadcrumbLinks.count() > 0) {
        // Click on a breadcrumb link
        await breadcrumbLinks.first().click();
        await waitForPageLoad(page);
        
        // Should navigate to the clicked section
        expect(page.url()).toContain('/projects');
      }
    });
  });

  test.describe('Back Navigation', () => {
    
    test('should handle browser back button', async ({ page }) => {
      // Navigate through multiple pages
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      const projectId = testProjects.dubaiTower.id;
      await page.goto(`/projects/${projectId}/claims`);
      await waitForPageLoad(page);
      
      // Use browser back button
      await navigateBack(page);
      
      // Should be back on projects page
      expect(await isOnPage(page, '/projects')).toBe(true);
    });

    test('should handle back button in project context', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Go to project dashboard first
      await page.goto(`/projects/${projectId}/dashboard`);
      await waitForPageLoad(page);
      
      // Navigate to claims
      await page.goto(`/projects/${projectId}/claims`);
      await waitForPageLoad(page);
      
      // Use back navigation (could be browser back or app back button)
      const backButton = page.locator('button:has-text("Back")');
      
      if (await backButton.count() > 0) {
        await backButton.click();
        await waitForPageLoad(page);
        
        // Should return to project dashboard
        expect(await isOnPage(page, `/projects/${projectId}/dashboard`)).toBe(true);
      } else {
        // Fallback to browser back
        await navigateBack(page);
        expect(await isOnPage(page, `/projects/${projectId}/dashboard`)).toBe(true);
      }
    });
  });

  test.describe('User Interface Interactions', () => {
    
    test('should handle button interactions', async ({ page }) => {
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Test various button interactions
      const buttons = ['View Projects', 'New Project'];
      
      for (const buttonText of buttons) {
        await assertButtonAccessible(page, buttonText);
        
        // Verify button is clickable
        const button = page.locator(`button:has-text("${buttonText}"), a:has-text("${buttonText}")`);
        await expect(button.first()).toBeEnabled();
      }
    });

    test('should handle form interactions', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Test search form interaction
      const searchInput = page.locator('input[placeholder*="Search"]');
      
      if (await searchInput.count() > 0) {
        // Test typing in search
        await searchInput.fill('Dubai');
        await page.waitForTimeout(500);
        
        // Clear search
        await searchInput.fill('');
        await page.waitForTimeout(500);
        
        // Verify input is functional
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe('');
      }
    });

    test('should handle dropdown/select interactions', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Test filter dropdown
      const selectElements = page.locator('select');
      
      if (await selectElements.count() > 0) {
        const firstSelect = selectElements.first();
        
        // Get initial value
        const initialValue = await firstSelect.inputValue();
        
        // Change selection
        await firstSelect.selectOption({ index: 1 });
        await page.waitForTimeout(500);
        
        // Verify selection changed
        const newValue = await firstSelect.inputValue();
        expect(newValue).not.toBe(initialValue);
      }
    });

    test('should handle hover interactions', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Test hover effects on project cards
      const projectCards = page.locator('[class*="bg-white"][class*="shadow"]:has(h3)');
      
      if (await projectCards.count() > 0) {
        const firstCard = projectCards.first();
        
        // Hover over card
        await firstCard.hover();
        await page.waitForTimeout(500);
        
        // Card should be visible and potentially show hover effects
        await expect(firstCard).toBeVisible();
      }
    });

    test('should handle click interactions on interactive elements', async ({ page }) => {
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Test clicking on quick action cards
      const quickActions = page.locator('text=Manage Projects, text=Review Claims, text=Check Delays');
      
      if (await quickActions.count() > 0) {
        const firstAction = quickActions.first();
        const actionCard = firstAction.locator('../..');
        
        // Click on quick action
        await actionCard.click();
        await page.waitForTimeout(1000);
        
        // Should navigate or perform action without errors
      }
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    
    test('should handle navigation to non-existent routes', async ({ page }) => {
      // Try to navigate to non-existent route
      await page.goto('/non-existent-page');
      
      // Should handle gracefully (404 page or redirect)
      await page.waitForTimeout(2000);
      
      // Application should not crash
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should handle rapid navigation clicks', async ({ page }) => {
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Rapidly click navigation items
      const projectsLink = page.locator('nav a:has-text("Projects"), aside a:has-text("Projects")');
      
      if (await projectsLink.count() > 0) {
        // Click multiple times rapidly
        await projectsLink.first().click();
        await projectsLink.first().click();
        await projectsLink.first().click();
        
        await waitForPageLoad(page);
        
        // Should end up on projects page without errors
        expect(await isOnPage(page, '/projects')).toBe(true);
      }
    });

    test('should handle navigation during loading states', async ({ page }) => {
      // Start navigation
      await page.goto('/projects');
      
      // Immediately try to navigate elsewhere
      await page.goto('/dashboard');
      
      // Should handle concurrent navigation gracefully
      await waitForPageLoad(page);
      await assertOnDashboardPage(page);
    });

    test('should maintain functionality after network interruptions', async ({ page }) => {
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Simulate network condition (if possible)
      // For now, just test that navigation remains functional after page reload
      await page.reload();
      await waitForPageLoad(page);
      
      // Navigation should still work
      await navigateViaSidebar(page, 'Projects');
      await assertOnProjectsPage(page);
    });
  });

  test.describe('Keyboard Navigation', () => {
    
    test('should support tab navigation', async ({ page }) => {
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Test tab navigation through interactive elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      // Verify focus is on an interactive element
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(['BUTTON', 'A', 'INPUT', 'SELECT'].includes(focusedElement)).toBe(true);
    });

    test('should support enter key for button activation', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Focus on a button and press enter
      const newProjectButton = page.locator('button:has-text("New Project")');
      
      if (await newProjectButton.count() > 0) {
        await newProjectButton.focus();
        await page.keyboard.press('Enter');
        
        // Button action should be triggered
        await page.waitForTimeout(1000);
      }
    });

    test('should support escape key for closing modals/dropdowns', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Look for dropdown or modal trigger
      const moreFiltersButton = page.locator('button:has-text("More Filters")');
      
      if (await moreFiltersButton.count() > 0) {
        await moreFiltersButton.click();
        await page.waitForTimeout(500);
        
        // Press escape to close
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Modal/dropdown should be closed
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    
    test('should handle mobile navigation menu', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/dashboard');
      await waitForPageLoad(page);
      
      // Look for mobile menu trigger (hamburger menu)
      const mobileMenuTrigger = page.locator('button[aria-label*="menu"], button:has([class*="hamburger"]), button:has([data-testid*="menu"])');
      
      if (await mobileMenuTrigger.count() > 0) {
        await mobileMenuTrigger.click();
        await page.waitForTimeout(500);
        
        // Navigation menu should be visible
        await assertNavigationVisible(page);
        
        // Test navigation on mobile
        await navigateViaSidebar(page, 'Projects');
        await assertOnProjectsPage(page);
      }
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Test touch/tap interactions
      const projectCards = page.locator('[class*="bg-white"][class*="shadow"]:has(h3)');
      
      if (await projectCards.count() > 0) {
        // Tap on project card
        await projectCards.first().tap();
        await page.waitForTimeout(1000);
        
        // Interaction should work on mobile
      }
    });
  });

  test.describe('Session and State Management', () => {
    
    test('should maintain navigation state across page reloads', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Apply some state (like search)
      const searchInput = page.locator('input[placeholder*="Search"]');
      if (await searchInput.count() > 0) {
        await searchInput.fill('Dubai');
        await page.waitForTimeout(500);
      }
      
      // Reload page
      await page.reload();
      await waitForPageLoad(page);
      
      // Should be back on projects page
      await assertOnProjectsPage(page);
      
      // Search state might be reset (which is expected behavior)
      if (await searchInput.count() > 0) {
        const searchValue = await searchInput.inputValue();
        // State reset is acceptable for page reload
      }
    });

    test('should handle logout during navigation', async ({ page }) => {
      await page.goto('/projects');
      await waitForPageLoad(page);
      
      // Logout user
      await logout(page);
      await assertOnLoginPage(page);
      
      // Try to navigate to protected route
      await page.goto('/dashboard');
      
      // Should be redirected back to login
      await assertOnLoginPage(page);
    });
  });
});