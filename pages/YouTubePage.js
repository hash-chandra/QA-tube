const { expect } = require('@playwright/test');

/**
 * Page Object Model for YouTube
 * Encapsulates all YouTube page interactions
 */
class YouTubePage {
  constructor(page) {
    this.page = page;
    
    // Selectors  
    this.searchBox = 'input[name="search_query"]';
    this.searchButton = 'button[aria-label="Search"]';

    this.videoThumbnail = 'ytd-video-renderer:not([is-ad-display]) a#video-title';
    this.videoRenderer = 'ytd-video-renderer:not([is-ad-display])';
    this.videoTitle = 'h1.ytd-watch-metadata yt-formatted-string, h1 yt-formatted-string';
    this.videoPlayer = 'video.html5-main-video';
    this.playPauseButton = 'button.ytp-play-button';
    this.videoProgressBar = '.ytp-progress-bar';
    this.currentTimeDisplay = '.ytp-time-current';
    this.adSkipButton = '.ytp-skip-ad-button__icon';
  }
 
  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
 
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
 
    await this.dismissCookieConsent();
  }

  /**
   * Dismiss cookie consent dialog if present
   */
  async dismissCookieConsent() {
    try {
 
      const consentButton = this.page.locator('button[aria-label*="Accept"], button[aria-label*="Reject"], button:has-text("Accept all"), button:has-text("Reject all")').first();
      const isVisible = await consentButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        await consentButton.click();
        console.log('Dismissed cookie consent');
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
 
    }
  }

  /**
   * Perform a search on YouTube
   * @param {string} searchTerm - The term to search for
   */
  async search(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    
    // Wait for search box to be visible
    await this.page.waitForSelector(this.searchBox, { timeout: 15000 });
    
    // Click on search box and type
    await this.page.click(this.searchBox);
    await this.page.fill(this.searchBox, searchTerm);
    
    // Press Enter or click search button
    await Promise.race([
      this.page.keyboard.press('Enter'),
      this.page.click(this.searchButton).catch(() => {})
    ]);
    
    // Wait for results to load
    await this.page.waitForSelector(this.videoThumbnail, { timeout: 20000 });
 
  }

  /**
   * Verify that search results are present
   * @returns {Promise<number>} - Number of video results found
   */
  async verifySearchResults() {
    // Wait a bit for ads to load and settle
    await this.page.waitForTimeout(1000);
    
    const results = await this.page.locator(this.videoRenderer).count();
    console.log(`Found ${results} organic video results (excluding ads)`);
    expect(results).toBeGreaterThan(0);
    return results;
  }

  /**
   * Click on the first video in search results (excluding ads)
   */
  async clickFirstVideo() {
 
    
    // Wait for organic video results to be visible
    await this.page.waitForSelector(this.videoRenderer, { timeout: 15000 });
    await this.page.waitForTimeout(1000); // Allow ads to settle
    
    // Get all organic video renderers (excluding ads)
    const organicVideos = this.page.locator(this.videoRenderer);
    const count = await organicVideos.count();
    console.log(`Found ${count} organic videos, clicking on first one`);
    
    // Click on the video title link within the first organic video
    await organicVideos.first().locator('a#video-title').click();
    
    // Wait for video player to be present
    await this.page.waitForSelector(this.videoPlayer, { timeout: 15000 });
    
    // Wait for skip button and click it
    await this.skipAdIfPresent();
  }

  /**
   * Skip ad if it appears - waits for skip button to be displayed and clicks it
   */
  async skipAdIfPresent() {
    try {
      console.log('Waiting for ad skip button to appear...');
      
      // Wait for skip button to be visible (max 30 seconds)
      await this.page.waitForSelector(this.adSkipButton, { 
        state: 'visible',
        timeout: 30000 
      });
      
      console.log('Ad skip button found, clicking...');
      await this.page.click(this.adSkipButton);
      console.log('Ad skipped successfully');
      await this.page.waitForTimeout(1000); // Allow video to stabilize
      
    } catch (error) {
 
    }
  }

  /**
   * Verify video is playing
   * @returns {Promise<boolean>} - True if video is playing
   */
  async isVideoPlaying() {
    const isPaused = await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video');
      return video ? video.paused : true;
    });
    return !isPaused;
  }

  /**
   * Wait for video to start playing
   */
  async waitForVideoToPlay() {
    console.log('Waiting for video to start playing...');
    
    await this.page.waitForFunction(
      () => {
        const video = document.querySelector('video.html5-main-video');
        return video && !video.paused && video.readyState >= 2;
      },
      { timeout: 15000 }
    );
    
    console.log('Video is playing');
  }

  /**
   * Pause the video
   */
  async pauseVideo() {
    console.log('Pausing video');
    
    const isPlaying = await this.isVideoPlaying();
    if (isPlaying) {
      // Click on the video player to pause
      await this.page.click(this.videoPlayer);
      await this.page.waitForTimeout(5000);
    }
  }

  /**
   * Verify video is paused
   */
  async verifyVideoPaused() {
    const isPaused = await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video');
      return video ? video.paused : false;
    });
    
    console.log(`Video paused status: ${isPaused}`);
    expect(isPaused).toBe(true);
  }

  /**
   * Get current video time
   * @returns {Promise<number>} - Current time in seconds
   */
  async getCurrentTime() {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video');
      return video ? video.currentTime : 0;
    });
  }

  /**
   * Seek to a specific time in the video
   * @param {number} seconds - Time to seek to in seconds
   */
  async seekToTime(seconds) {
    console.log(`Seeking to ${seconds} seconds`);
    
    await this.page.evaluate((seekTime) => {
      const video = document.querySelector('video.html5-main-video');
      if (video) {
        video.currentTime = seekTime;
      }
    }, seconds);
    
    await this.page.waitForTimeout(5000);
  }

  /**
   * Verify video time has advanced
   * @param {number} initialTime - Initial time before seeking
   * @param {number} expectedMinTime - Minimum expected time after seeking
   */
  async verifyTimeAdvanced(initialTime, expectedMinTime) {
    const currentTime = await this.getCurrentTime();
    console.log(`Initial time: ${initialTime}s, Current time: ${currentTime}s`);
    
    expect(currentTime).toBeGreaterThan(initialTime);
    expect(currentTime).toBeGreaterThanOrEqual(expectedMinTime - 1); // Allow 1s tolerance
  }

  /**
   * Take a screenshot of the video player
   * @param {string} filename - Name of the screenshot file
   */
  async takeScreenshot(filename) {
    const screenshotPath = `screenshots/${filename}`;
    console.log(`Taking screenshot: ${screenshotPath}`);
    
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: false
    });
    
    return screenshotPath;
  }

  /**
   * Get the video title
   * @returns {Promise<string>} - Video title text
   */
  async getVideoTitle() {
    await this.page.waitForSelector(this.videoTitle, { timeout: 10000 });
    const title = await this.page.locator(this.videoTitle).first().textContent();
    console.log(`Video title: ${title}`);
    return title?.trim() || '';
  }

  /**
   * Verify video title is not empty
   */
  async verifyVideoTitle() {
    const title = await this.getVideoTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  }
}

module.exports = YouTubePage;
