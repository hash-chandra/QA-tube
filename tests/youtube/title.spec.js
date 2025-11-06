const { test, expect } = require('@playwright/test');
const YouTubePage = require('../../pages/YouTubePage');
const testData = require('../../test-data/youtube.data');
const hooks = require('../fixtures/hooks');
const TestHelpers = require('../../utils/helpers');

test.describe('Title Tests', () => {
  test.beforeAll(hooks.beforeAll);

  test('Verify video title is not empty', async ({ page }) => {
    const youtubePage = new YouTubePage(page);

    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await youtubePage.clickFirstVideo();
    await youtubePage.waitForVideoToPlay();

    await youtubePage.verifyVideoTitle();
    const title = await youtubePage.getVideoTitle();
    
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(testData.expectations.minTitleLength);
    console.log(`✓ Verified: Video title is "${title}"`);
  });
});
