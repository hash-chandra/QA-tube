const { test, expect } = require('@playwright/test');
const YouTubePage = require('../../pages/YouTubePage');
const testData = require('../../test-data/youtube.data');
const hooks = require('../fixtures/hooks');
const TestHelpers = require('../../utils/helpers');

test.describe('Seek Vidoe Tests', () => {
  test.beforeAll(hooks.beforeAll);

  test('Seek to later point and verify time advanced', async ({ page }) => {
    const youtubePage = new YouTubePage(page);
    const seekTime = testData.playback.seekTime;

    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await youtubePage.clickFirstVideo();
    await youtubePage.waitForVideoToPlay();

    const initialTime = await youtubePage.getCurrentTime();
    console.log(`Initial time: ${TestHelpers.formatTime(initialTime)}`);
    
    await youtubePage.seekToTime(seekTime);
    await youtubePage.verifyTimeAdvanced(initialTime, seekTime);
    
    const newTime = await youtubePage.getCurrentTime();
    console.log(`✓ Verified: Time advanced to ${TestHelpers.formatTime(newTime)}`);
    
    expect(newTime).toBeGreaterThan(initialTime);
    expect(newTime).toBeGreaterThanOrEqual(seekTime - 1);
  });
});
