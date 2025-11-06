const { test, expect } = require('@playwright/test');
const YouTubePage = require('../../pages/YouTubePage');
const testData = require('../../test-data/youtube.data');
const hooks = require('../fixtures/hooks');
const TestHelpers = require('../../utils/helpers');

test.describe('Playback Video Tests', () => {
  test.beforeAll(hooks.beforeAll);

  test('Click video and verify playback starts', async ({ page }) => {
    const youtubePage = new YouTubePage(page);

    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await youtubePage.verifySearchResults();

    await youtubePage.clickFirstVideo();
    
    await youtubePage.waitForVideoToPlay();
    const isPlaying = await youtubePage.isVideoPlaying();
    
    expect(isPlaying).toBe(true);
    console.log('✓ Verified: Video is playing');
  });
});
