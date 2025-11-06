const { test, expect } = require('@playwright/test');
const YouTubePage = require('../../pages/YouTubePage');
const testData = require('../../test-data/youtube.data');
const hooks = require('../fixtures/hooks');
const TestHelpers = require('../../utils/helpers');
const path = require('path');

test.describe('Screenshot Tests', () => {
  test.beforeAll(hooks.beforeAll);

  test('Take screenshot and verify file exists', async ({ page }) => {
    const youtubePage = new YouTubePage(page);
    const screenshotFilename = `${testData.screenshot.prefix}-${TestHelpers.getTimestamp()}.png`;

    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await youtubePage.clickFirstVideo();
    await youtubePage.waitForVideoToPlay();

    const screenshotPath = await youtubePage.takeScreenshot(screenshotFilename);
    
    // Verify screenshot exists
    const fullPath = path.resolve(screenshotPath);
    const exists = TestHelpers.fileExists(fullPath);
    expect(exists).toBe(true);
    
    const fileSize = TestHelpers.getFileSize(fullPath);
    expect(fileSize).toBeGreaterThan(testData.expectations.minScreenshotSize);
    console.log(`✓ Verified: Screenshot saved at ${screenshotPath} (${fileSize} bytes)`);
  });
});
