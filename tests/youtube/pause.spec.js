const { test, expect } = require('@playwright/test');
const YouTubePage = require('../../pages/YouTubePage');
const testData = require('../../test-data/youtube.data');
const hooks = require('../fixtures/hooks');
const TestHelpers = require('../../utils/helpers');

test.describe('Pause Video Tests', () => {
  test.beforeAll(hooks.beforeAll);

  test('Pause video and verify it stops', async ({ page }) => {
    const youtubePage = new YouTubePage(page);

    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await youtubePage.clickFirstVideo();
    await youtubePage.waitForVideoToPlay();

    await youtubePage.pauseVideo();
    await youtubePage.verifyVideoPaused();
    
    const isPaused = await youtubePage.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video');
      return video ? video.paused : false;
    });
    
    expect(isPaused).toBe(true);
    console.log('✓ Verified: Video is paused');
  });
});
