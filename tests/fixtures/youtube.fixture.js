const YouTubePage = require('../../pages/YouTubePage');
const TestHelpers = require('../../utils/helpers');
const testData = require('../../test-data/youtube.data');

/**
 * Extended test fixtures for YouTube tests
 * Provides common setup and teardown logic
 */
exports.test = base.extend({
  // YouTube page fixture
  youtubePage: async ({ page }, use) => {
    const youtubePage = new YouTubePage(page);
    await use(youtubePage);
  },

  // Pre-navigated YouTube page
  youtubePageWithNavigation: async ({ page }, use) => {
    const youtubePage = new YouTubePage(page);
    await youtubePage.goto();
    await use(youtubePage);
  },

  // YouTube page with search already performed
  youtubePageWithSearch: async ({ page }, use) => {
    const youtubePage = new YouTubePage(page);
    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await use(youtubePage);
  },

  // YouTube page with video already playing
  youtubePageWithVideo: async ({ page }, use) => {
    const youtubePage = new YouTubePage(page);
    await youtubePage.goto();
    await youtubePage.search(testData.searchTerms.default);
    await youtubePage.clickFirstVideo();
    await youtubePage.waitForVideoToPlay();
    await use(youtubePage);
  },
});

exports.expect = require('@playwright/test').expect;
exports.testData = testData;
exports.TestHelpers = TestHelpers;
