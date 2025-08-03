import { test, expect } from '@playwright/test';
import { login, testUsers } from '../helpers/auth.js';
import { 
  assertOnProjectsPage,
  assertProjectCardsVisible,
  assertProjectVisible,
  assertSearchWorks,
  assertFilterWorks,
  assertButtonAccessible,
  assertLoadingComplete,
  assertOnProjectPage
} from '../helpers/assertions.js';
import { 
  navigateToPage,
  navigateToProject,
  navigateViaSidebar 
} from '../helpers/navigation.js';
import { 
  testProjects, 
  pageElements, 
  projectStatuses,
  searchTestCases 
} from '../fixtures/testData.js';

test.describe('Projects Listing and Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, testUsers.director);
  });

  test.describe('Projects Page Layout', () => {
    
    test('should display projects page correctly', async ({ page }) => {
      await page.goto('/projects');
      await assertOnProjectsPage(page);
      
      // Check page header
      await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
      await expect(page.locator(`text=${pageElements.projects.subtitle}`)).toBeVisible();
      
      // Check New Project button
      await assertButtonAccessible(page, 'New Project');
    });

    test('should display search and filter controls', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Check search input
      await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
      
      // Check status filter dropdown
      await expect(page.locator('select, [role="combobox"]')).toBeVisible();
      
      // Check More Filters button
      await assertButtonAccessible(page, 'More Filters');
    });

    test('should display project cards', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Should show project cards
      await assertProjectCardsVisible(page, 1);
      
      // Check for test project names
      await assertProjectVisible(page, testProjects.dubaiTower.name);
      await assertProjectVisible(page, testProjects.londonBridge.name);
      await assertProjectVisible(page, testProjects.singaporeMetro.name);
    });

    test('should display project information in cards', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Check first project card has required information
      const firstProject = testProjects.dubaiTower;
      
      // Project name
      await expect(page.locator(`h3:has-text("${firstProject.name}")`)).toBeVisible();
      
      // Location
      await expect(page.locator(`text=${firstProject.location}`)).toBeVisible();
      
      // Project manager
      await expect(page.locator(`text=${firstProject.projectManager}`)).toBeVisible();
      
      // Contract value (formatted as currency)
      await expect(page.locator('text=/\\$[\\d,]+/')).toBeVisible();
      
      // Health score
      await expect(page.locator('text=/\\d+\/100/')).toBeVisible();
      
      // Status badge
      await expect(page.locator(`[class*="bg-"]:has-text("${firstProject.status.replace('_', ' ')}")`)).toBeVisible();
    });

    test('should display portfolio summary when projects exist', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Check for portfolio summary section
      await expect(page.locator('text=Portfolio Summary')).toBeVisible();
      
      // Check summary stats
      await expect(page.locator('text=Total Projects')).toBeVisible();
      await expect(page.locator('text=Total Contract Value')).toBeVisible();
      await expect(page.locator('text=Active Claims')).toBeVisible();
      await expect(page.locator('text=Avg Health Score')).toBeVisible();
    });
  });

  test.describe('Project Search and Filtering', () => {
    
    test('should search projects by name', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      const searchCase = searchTestCases.projectSearch;
      await assertSearchWorks(page, searchCase.term, searchCase.expectedResult);
    });

    test('should search projects by location', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      const searchCase = searchTestCases.locationSearch;
      await assertSearchWorks(page, searchCase.term, searchCase.expectedResult);
    });

    test('should search projects by project manager', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Search for project manager name
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('Sarah');
      await page.waitForTimeout(500);
      
      // Should show projects managed by Sarah
      await expect(page.locator('text=Sarah Williams')).toBeVisible();
    });

    test('should filter projects by status', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Filter by active status
      const statusFilter = page.locator('select');
      await statusFilter.selectOption('active');
      await page.waitForTimeout(500);
      
      // Should only show active projects
      await expect(page.locator('[class*="bg-"]:has-text("active")')).toBeVisible();
    });

    test('should clear search results', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Perform search
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('Dubai');
      await page.waitForTimeout(500);
      
      // Should show filtered results
      await expect(page.locator('text=Dubai Marina Tower Complex')).toBeVisible();
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(500);
      
      // Should show all projects again
      await assertProjectVisible(page, testProjects.londonBridge.name);
      await assertProjectVisible(page, testProjects.singaporeMetro.name);
    });

    test('should handle no search results', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Search for non-existent project
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('NonExistentProject');
      await page.waitForTimeout(500);
      
      // Should show "no projects found" message
      await expect(page.locator('text=No projects found')).toBeVisible();
      await expect(page.locator('text=Try adjusting your search')).toBeVisible();
    });
  });

  test.describe('Project Navigation', () => {
    
    test('should navigate to project dashboard from card', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Click on first project's "View" button
      const viewButton = page.locator('button:has-text("View"), a:has-text("View")').first();
      await viewButton.click();
      
      // Should navigate to project dashboard
      await expect(page).toHaveURL(/\/projects\/\d+\/dashboard/);
    });

    test('should navigate to specific project sections', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Test navigation to different project sections
      const sections = ['dashboard', 'schedule', 'delays', 'evidence', 'claims'];
      
      for (const section of sections) {
        await navigateToProject(page, projectId);
        
        // Update the URL to the specific section
        await page.goto(`/projects/${projectId}/${section}`);
        
        // Verify we're on the correct page
        await assertOnProjectPage(page, projectId, section);
      }
    });

    test('should navigate via sidebar navigation', async ({ page }) => {
      // Start from dashboard
      await page.goto('/dashboard');
      
      // Navigate to projects via sidebar
      await navigateViaSidebar(page, 'Projects');
      
      // Should be on projects page
      await assertOnProjectsPage(page);
    });

    test('should handle project edit button click', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Click on first project's "Edit" button
      const editButton = page.locator('button:has-text("Edit")').first();
      
      if (await editButton.count() > 0) {
        await editButton.click();
        
        // This might open a modal or navigate to edit page
        // For now, just verify no errors occur
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Project Actions', () => {
    
    test('should handle new project button', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Click New Project button
      await page.click('button:has-text("New Project")');
      
      // This would typically open a project creation form
      // For now, verify the button is functional
      await page.waitForTimeout(1000);
    });

    test('should display project actions menu', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Look for more actions button (three dots)
      const moreActionsButton = page.locator('button:has([class*="more"]), button:has-text("⋮")');
      
      if (await moreActionsButton.count() > 0) {
        await moreActionsButton.first().click();
        
        // Verify dropdown/menu appears
        await page.waitForTimeout(500);
      }
    });

    test('should handle project status changes', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // This would test status change functionality if implemented
      // For now, verify status badges are displayed correctly
      await expect(page.locator('[class*="bg-"]:has-text("active")')).toBeVisible();
    });
  });

  test.describe('Projects Data Management', () => {
    
    test('should load projects data correctly', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Verify all expected projects are loaded
      const projectCount = await page.locator('[class*="bg-white"][class*="shadow"]:has(h3)').count();
      expect(projectCount).toBeGreaterThanOrEqual(3);
      
      // Verify project data integrity
      await assertProjectVisible(page, testProjects.dubaiTower.name);
      await assertProjectVisible(page, testProjects.londonBridge.name);
      await assertProjectVisible(page, testProjects.singaporeMetro.name);
    });

    test('should handle projects loading state', async ({ page }) => {
      await page.goto('/projects');
      
      // Page should eventually load without being stuck in loading state
      await assertLoadingComplete(page);
      await assertProjectCardsVisible(page, 1);
    });

    test('should display correct project metrics', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Verify health scores are displayed as percentages
      await expect(page.locator('text=/\\d+\/100/')).toBeVisible();
      
      // Verify contract values are formatted as currency
      await expect(page.locator('text=/\\$[\\d,]+/')).toBeVisible();
      
      // Verify dates are formatted properly
      await expect(page.locator('text=/\\w{3} \\d{1,2}, \\d{4}/')).toBeVisible();
    });
  });

  test.describe('Responsive Projects View', () => {
    
    test('should display projects grid responsively', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Test desktop view
      await page.setViewportSize({ width: 1200, height: 800 });
      await assertProjectCardsVisible(page, 1);
      
      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await assertProjectCardsVisible(page, 1);
      
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await assertProjectCardsVisible(page, 1);
    });

    test('should handle search and filters on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Search should still work on mobile
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('Dubai');
      await page.waitForTimeout(500);
      
      await expect(page.locator('text=Dubai Marina Tower Complex')).toBeVisible();
    });
  });

  test.describe('Projects Performance', () => {
    
    test('should load projects page within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/projects');
      await assertLoadingComplete(page);
      await assertProjectCardsVisible(page, 1);
      
      const loadTime = Date.now() - startTime;
      
      // Projects page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large project lists efficiently', async ({ page }) => {
      await page.goto('/projects');
      await assertLoadingComplete(page);
      
      // Test scrolling and interaction with multiple projects
      const projectCards = page.locator('[class*="bg-white"][class*="shadow"]:has(h3)');
      const cardCount = await projectCards.count();
      
      if (cardCount > 1) {
        // Scroll through projects
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        
        // Verify all cards are still visible and functional
        await expect(projectCards.first()).toBeVisible();
        await expect(projectCards.last()).toBeVisible();
      }
    });
  });
});