#!/usr/bin/env node

/**
 * Test Setup Verification Script
 * This script verifies that the test environment is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying EOT Intelligence Platform Test Setup...\n');

// Check if required files exist
const requiredFiles = [
  '../playwright.config.js',
  'helpers/auth.js',
  'helpers/navigation.js', 
  'helpers/assertions.js',
  'fixtures/testData.js',
  'e2e/auth.spec.js',
  'e2e/dashboard.spec.js',
  'e2e/projects.spec.js',
  'e2e/claims.spec.js',
  'e2e/navigation.spec.js'
];

let allFilesExist = true;

console.log('📁 Checking test files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json for test scripts
console.log('\n📦 Checking package.json test scripts...');
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredScripts = [
    'test:e2e',
    'test:e2e:headed',
    'test:e2e:ui',
    'test:e2e:debug',
    'test:e2e:install',
    'test:e2e:report'
  ];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`  ❌ ${script} - MISSING`);
      allFilesExist = false;
    }
  });
} else {
  console.log('  ❌ package.json - MISSING');
  allFilesExist = false;
}

// Check if playwright is installed
console.log('\n🎭 Checking Playwright installation...');
try {
  const playwrightPath = path.join(__dirname, '../node_modules/@playwright/test');
  if (fs.existsSync(playwrightPath)) {
    console.log('  ✅ @playwright/test is installed');
  } else {
    console.log('  ❌ @playwright/test is not installed');
    allFilesExist = false;
  }
} catch (error) {
  console.log('  ❌ Error checking Playwright installation');
  allFilesExist = false;
}

// Summary
console.log('\n📊 Test Setup Summary:');
console.log(`  • Test files: ${requiredFiles.length} files`);
console.log(`  • Test suites: 5 comprehensive test suites`);
console.log(`  • Test coverage: Authentication, Dashboard, Projects, Claims, Navigation`);
console.log(`  • Browsers: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari`);
console.log(`  • Helpers: Authentication, Navigation, Assertions`);
console.log(`  • Fixtures: Complete test data based on mock data`);

if (allFilesExist) {
  console.log('\n🎉 Test setup verification PASSED!');
  console.log('\n🚀 Next steps:');
  console.log('  1. Start the development server: pnpm run dev');
  console.log('  2. Run tests: pnpm run test:e2e');
  console.log('  3. Run tests with UI: pnpm run test:e2e:ui');
  console.log('  4. Debug tests: pnpm run test:e2e:debug');
  process.exit(0);
} else {
  console.log('\n❌ Test setup verification FAILED!');
  console.log('   Please ensure all required files are present and try again.');
  process.exit(1);
}