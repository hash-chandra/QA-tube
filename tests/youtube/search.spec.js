const { test, expect } = require('@playwright/test');
const YouTubePage = require('../../pages/YouTubePage');
const testData = require('../../test-data/youtube.data');
const hooks = require('../fixtures/hooks');
const TestHelpers = require('../../utils/helpers');

test.describe('Search Tests', () => {
  test.beforeAll(hooks.beforeAll);

  test('Search and verify results', async ({ page }) => {
    const youtubePage = new YouTubePage(page);

    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    
    const resultsCount = await youtubePage.verifySearchResults();
    console.log(`✓ Verified: Found ${resultsCount} search results`);
    
    expect(resultsCount).toBeGreaterThan(testData.expectations.minSearchResults);
  });
});
