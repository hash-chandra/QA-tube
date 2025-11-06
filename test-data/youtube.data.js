/**
 * Test data for YouTube E2E tests
 */

module.exports = {
  // Search terms
  searchTerms: {
    default: 'QA automation'
  },

  // Video playback settings
  playback: {
    seekTime: 10, // seconds
    waitTimeBeforePause: 2000, // milliseconds
    adSkipTimeout: 5000, // milliseconds
  },

  // Screenshot settings
  screenshot: {
    quality: 90,
    fullPage: false,
    prefix: 'youtube-test',
  },

  // Timeouts
  timeouts: {
    searchResults: 20000,
    videoLoad: 15000,
    videoPlay: 15000,
    navigation: 30000,
  },

  // Expected results
  expectations: {
    minSearchResults: 1,
    minTitleLength: 1,
    minScreenshotSize: 1000, // bytes
  },
};
