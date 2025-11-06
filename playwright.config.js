// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true, // Enable parallel execution of all tests
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // Run 3 tests in parallel (or 1 in CI)
  maxFailures: 0, // Continue running all tests even if some fail (0 means no limit)
  reporter: [
    ['html'],
    ['list']
  ],
  timeout: 90000, // Increased to 90 seconds to accommodate 20-second ad wait
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: 'https://www.youtube.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        }
      },
    },
    
    // Mobile Android - Samsung Galaxy S24 (Android 15)
    {
      name: 'android-samsung',
      use: {
        ...devices['Galaxy S9+'], // Base Samsung device config
        // Override with Android 15 specific settings
        userAgent: 'Mozilla/5.0 (Linux; Android 15; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        viewport: { width: 384, height: 854 }, // Samsung Galaxy S24 resolution
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
    
    // Mobile iOS - iPhone 17 (iOS 18)
    {
      name: 'ios-iphone',
      use: {
        ...devices['iPhone 14 Pro'], // Base iPhone config
        // Override with iPhone 17 / iOS 18 specific settings
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 393, height: 852 }, // iPhone 17 resolution
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'webkit',
      },
    },
  ],
});
