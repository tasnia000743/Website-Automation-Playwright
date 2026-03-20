import { Page, BrowserContext, Locator } from '@playwright/test';

/**
 * Browser utility class for browser-specific operations
 */
export class BrowserUtils {

  /**
   * Clears browser cookies
   * @param context Browser context
   */
  static async clearCookies(context: BrowserContext): Promise<void> {
    await context.clearCookies();
  }

  /**
   * Clears browser storage (localStorage, sessionStorage)
   * @param page Page object
   */
  static async clearStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Sets viewport size
   * @param page Page object
   * @param width Viewport width
   * @param height Viewport height
   */
  static async setViewport(page: Page, width: number, height: number): Promise<void> {
    await page.setViewportSize({ width, height });
  }

  /**
   * Takes full page screenshot
   * @param page Page object
   * @param filename Screenshot filename
   */
  static async takeFullPageScreenshot(page: Page, filename: string): Promise<void> {
    await page.screenshot({ 
      path: `screenshots/${filename}.png`, 
      fullPage: true 
    });
  }

  /**
    * Scrolls to an element
    * @param locator Element locator
    */
  async scroll(
   locator: Locator,
   page: Page,
   scrollType: 'scrollTo' | 'scrollBy' | 'scrollIntoElement',
   offsetX?: number,
   offsetY?: number
 ): Promise<void> {
 
   if (scrollType === 'scrollIntoElement') {
     await locator.scrollIntoViewIfNeeded();
 
   } else if (scrollType === 'scrollBy') {
 
     await page.evaluate((args: any) => {
       (globalThis as any).scrollBy(args.x, args.y);
     }, { x: offsetX, y: offsetY });
 
   } else { // scrollTo
    await page.evaluate((args: any) => {
      (globalThis as any).scrollTo(args.x, args.y);
     }, { x: offsetX, y: offsetY });
 
   }
 }

  

  /**
   * Gets page performance metrics
   * @param page Page object
   * @returns Performance metrics
   */
  static async getPerformanceMetrics(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation' as any)[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
  }
}
