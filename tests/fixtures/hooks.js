const TestHelpers = require('../../utils/helpers');

/**
 * Global hooks for YouTube tests
 */
module.exports = {
  /**
   * Setup that runs before all tests
   */
  beforeAll: async () => {
    // Ensure screenshots directory exists
    TestHelpers.ensureDirectoryExists('screenshots');
 
  },

  /**
   * Setup that runs before each test
   */
  beforeEach: async () => {
    // Add any pre-test setup here
  },

  /**
   * Cleanup that runs after each test
   */
  afterEach: async () => {
    // Add any post-test cleanup here
  },

  /**
   * Cleanup that runs after all tests
   */
  afterAll: async () => {
    // Add any suite cleanup here
  },
};
