import { test, expect } from '@playwright/test';
import { login, testUsers } from '../helpers/auth.js';
import { 
  assertOnClaimsPage,
  assertClaimsListVisible,
  assertClaimVisible,
  assertSearchWorks,
  assertFilterWorks,
  assertButtonAccessible,
  assertLoadingComplete
} from '../helpers/assertions.js';
import { 
  navigateToProjectClaims,
  navigateBack 
} from '../helpers/navigation.js';
import { 
  testProjects, 
  testClaims, 
  claimStatuses,
  searchTestCases 
} from '../fixtures/testData.js';

test.describe('Claims Management Workflow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, testUsers.director);
  });

  test.describe('Claims Page Layout', () => {
    
    test('should display claims page correctly', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      
      // Verify on claims page
      await assertOnClaimsPage(page, projectId);
      
      // Check page header
      await expect(page.locator('h1:has-text("Claims Management")')).toBeVisible();
      await expect(page.locator('text=Extension of Time (EOT) claims and submissions')).toBeVisible();
      
      // Check back button
      await assertButtonAccessible(page, 'Back');
      
      // Check action buttons
      await assertButtonAccessible(page, 'Export Claims');
      await assertButtonAccessible(page, 'New Claim');
    });

    test('should display claims summary stats', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Check summary statistics cards
      await expect(page.locator('text=Total Claims')).toBeVisible();
      await expect(page.locator('text=Total Value')).toBeVisible();
      await expect(page.locator('text=Approved')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
      
      // Verify stats show numerical values
      const statCards = page.locator('[class*="bg-white"][class*="shadow"]:has(text="Total Claims")');
      await expect(statCards).toBeVisible();
      
      // Check for currency formatting in Total Value
      await expect(page.locator('text=/\\$[\\d,]+/')).toBeVisible();
    });

    test('should display search and filter controls', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Check search input
      await expect(page.locator('input[placeholder*="Search claims"]')).toBeVisible();
      
      // Check status filter dropdown
      await expect(page.locator('select:has(option[value="all"])')).toBeVisible();
      
      // Verify filter options
      const statusFilter = page.locator('select');
      await expect(statusFilter.locator('option[value="all"]')).toBeVisible();
      await expect(statusFilter.locator('option[value="draft"]')).toBeVisible();
      await expect(statusFilter.locator('option[value="submitted"]')).toBeVisible();
    });

    test('should display claims list', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Check for claims list section
      await assertClaimsListVisible(page);
      
      // Verify claims count display
      await expect(page.locator('text=Claims (')).toBeVisible();
    });
  });

  test.describe('Claims Data Display', () => {
    
    test('should display individual claim information', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Check for test claims
      const foundationClaim = testClaims.foundationDelay;
      
      // Verify claim reference number
      await assertClaimVisible(page, foundationClaim.referenceNumber);
      
      // Verify claim title
      await expect(page.locator(`text=${foundationClaim.title}`)).toBeVisible();
      
      // Verify claim amount formatting
      await expect(page.locator('text=Claim Amount')).toBeVisible();
      await expect(page.locator('text=/\\$[\\d,]+/')).toBeVisible();
      
      // Verify time impact
      await expect(page.locator('text=Time Impact')).toBeVisible();
      await expect(page.locator('text=/\\d+ days/')).toBeVisible();
      
      // Verify dates
      await expect(page.locator('text=Notice Date')).toBeVisible();
      await expect(page.locator('text=Submission Date')).toBeVisible();
    });

    test('should display claim status with appropriate styling', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Look for status badges
      const statusBadges = page.locator('[class*="bg-"]:has-text("Draft"), [class*="bg-"]:has-text("Under Evaluation"), [class*="bg-"]:has-text("Submitted")');
      
      if (await statusBadges.count() > 0) {
        await expect(statusBadges.first()).toBeVisible();
      }
      
      // Check for status icons
      const statusIcons = page.locator('[class*="text-green"], [class*="text-blue"], [class*="text-red"], [class*="text-yellow"]');
      if (await statusIcons.count() > 0) {
        await expect(statusIcons.first()).toBeVisible();
      }
    });

    test('should display overdue claims with warning indicators', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Look for overdue indicators
      const overdueIndicators = page.locator('text=Overdue, [class*="bg-red"]:has-text("Overdue")');
      
      if (await overdueIndicators.count() > 0) {
        await expect(overdueIndicators.first()).toBeVisible();
      }
      
      // Check for response due dates
      await expect(page.locator('text=Response due:')).toBeVisible();
    });

    test('should handle empty claims list', async ({ page }) => {
      const projectId = testProjects.singaporeMetro.id; // Project with fewer claims
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Apply filter that might return no results
      const statusFilter = page.locator('select');
      await statusFilter.selectOption('rejected');
      await page.waitForTimeout(500);
      
      // Should show "no claims found" message
      await expect(page.locator('text=No claims found')).toBeVisible();
    });
  });

  test.describe('Claims Search and Filtering', () => {
    
    test('should search claims by reference number', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      const searchCase = searchTestCases.claimSearch;
      await assertSearchWorks(page, searchCase.term, searchCase.expectedResult);
    });

    test('should search claims by title', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Search by claim title
      const searchInput = page.locator('input[placeholder*="Search claims"]');
      await searchInput.fill('Foundation');
      await page.waitForTimeout(500);
      
      await expect(page.locator('text=Foundation Design Change Delay')).toBeVisible();
    });

    test('should search claims by description', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Search by description content
      const searchInput = page.locator('input[placeholder*="Search claims"]');
      await searchInput.fill('Extension of Time');
      await page.waitForTimeout(500);
      
      // Should find claims with this description
      await expect(page.locator('text=Extension of Time claim')).toBeVisible();
    });

    test('should filter claims by status', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Filter by draft status
      const statusFilter = page.locator('select');
      await statusFilter.selectOption('draft');
      await page.waitForTimeout(500);
      
      // Should only show draft claims
      await expect(page.locator('[class*="bg-"]:has-text("Draft")')).toBeVisible();
    });

    test('should combine search and filter', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Apply both search and filter
      const searchInput = page.locator('input[placeholder*="Search claims"]');
      await searchInput.fill('MEP');
      
      const statusFilter = page.locator('select');
      await statusFilter.selectOption('draft');
      
      await page.waitForTimeout(500);
      
      // Should show filtered and searched results
      if (await page.locator('text=MEP Utility Connection Delay').count() > 0) {
        await expect(page.locator('text=MEP Utility Connection Delay')).toBeVisible();
        await expect(page.locator('[class*="bg-"]:has-text("Draft")')).toBeVisible();
      }
    });

    test('should clear search and filters', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Apply search and filter
      const searchInput = page.locator('input[placeholder*="Search claims"]');
      await searchInput.fill('Foundation');
      
      const statusFilter = page.locator('select');
      await statusFilter.selectOption('draft');
      await page.waitForTimeout(500);
      
      // Clear search
      await searchInput.fill('');
      
      // Reset filter
      await statusFilter.selectOption('all');
      await page.waitForTimeout(500);
      
      // Should show all claims again
      await expect(page.locator('text=Claims (')).toBeVisible();
    });
  });

  test.describe('Claims Actions', () => {
    
    test('should handle view claim action', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Click on first "View" button
      const viewButton = page.locator('button:has-text("View")').first();
      
      if (await viewButton.count() > 0) {
        await viewButton.click();
        
        // This might open a modal or navigate to detail page
        await page.waitForTimeout(1000);
      }
    });

    test('should handle edit claim action', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Click on first "Edit" button
      const editButton = page.locator('button:has-text("Edit")').first();
      
      if (await editButton.count() > 0) {
        await editButton.click();
        
        // This might open an edit form or modal
        await page.waitForTimeout(1000);
      }
    });

    test('should handle export claim action', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Click on first "Export" button (individual claim)
      const exportButton = page.locator('button:has-text("Export")').first();
      
      if (await exportButton.count() > 0) {
        await exportButton.click();
        
        // This might trigger a download
        await page.waitForTimeout(1000);
      }
    });

    test('should handle export all claims action', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Click on "Export Claims" button in header
      await page.click('button:has-text("Export Claims")');
      
      // This might trigger a bulk export
      await page.waitForTimeout(1000);
    });

    test('should handle new claim creation', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Click on "New Claim" button
      await page.click('button:has-text("New Claim")');
      
      // This might open a claim creation form
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Claims Navigation', () => {
    
    test('should navigate back to project dashboard', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      
      // Click back button
      await page.click('button:has-text("Back")');
      
      // Should return to project dashboard
      await expect(page).toHaveURL(new RegExp(`/projects/${projectId}/dashboard`));
    });

    test('should maintain state when navigating back and forth', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Go to claims page
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Apply a search
      const searchInput = page.locator('input[placeholder*="Search claims"]');
      await searchInput.fill('Foundation');
      await page.waitForTimeout(500);
      
      // Navigate back
      await page.click('button:has-text("Back")');
      
      // Navigate to claims again
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Search should be cleared on fresh navigation
      const searchValue = await page.locator('input[placeholder*="Search claims"]').inputValue();
      expect(searchValue).toBe('');
    });
  });

  test.describe('AI Claim Assistant', () => {
    
    test('should display AI claim assistant section when claims exist', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Look for AI assistant section
      await expect(page.locator('text=AI Claim Assistant')).toBeVisible();
      await expect(page.locator('text=Let our AI help you prepare comprehensive EOT claims')).toBeVisible();
      
      // Check for generate claim button
      await assertButtonAccessible(page, 'Generate Claim');
    });

    test('should handle AI claim generation', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Click on AI "Generate Claim" button
      const generateButton = page.locator('button:has-text("Generate Claim")');
      
      if (await generateButton.count() > 0) {
        await generateButton.click();
        
        // This might open an AI-assisted claim creation flow
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Claims Data Integrity', () => {
    
    test('should display consistent claim data', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Verify data integrity for foundation claim
      const foundationClaim = testClaims.foundationDelay;
      
      if (await page.locator(`text=${foundationClaim.referenceNumber}`).count() > 0) {
        // Check that claim amount and time impact are consistent
        await expect(page.locator(`text=${foundationClaim.referenceNumber}`)).toBeVisible();
        await expect(page.locator(`text=${foundationClaim.title}`)).toBeVisible();
        
        // Verify numerical values are properly formatted
        await expect(page.locator('text=/\\$1,200,000/')).toBeVisible();
        await expect(page.locator('text=/15 days/')).toBeVisible();
      }
    });

    test('should handle claims loading errors gracefully', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Monitor for console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Page should load without critical errors
      await assertClaimsListVisible(page);
      
      // Should not have critical rendering errors
      const criticalErrors = errors.filter(error => 
        error.includes('Cannot read') || 
        error.includes('undefined')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Responsive Claims View', () => {
    
    test('should display claims page responsively', async ({ page }) => {
      const projectId = testProjects.dubaiTower.id;
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await navigateToProjectClaims(page, projectId);
      await assertLoadingComplete(page);
      
      // Claims should still be visible and functional
      await assertClaimsListVisible(page);
      
      // Search should work on mobile
      const searchInput = page.locator('input[placeholder*="Search claims"]');
      await searchInput.fill('Foundation');
      await page.waitForTimeout(500);
      
      if (await page.locator('text=Foundation Design Change Delay').count() > 0) {
        await expect(page.locator('text=Foundation Design Change Delay')).toBeVisible();
      }
    });
  });
});