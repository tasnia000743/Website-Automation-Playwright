import { Locator, Page, expect} from "playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
    protected page: Page;
    
  constructor(page: Page) {
    super(page);
    this.page= page;
  }

  /**
 * Waits until the browser URL contains "dashboard".
 * Uses a regular expression to match the dashboard route
 * and waits up to 900 seconds for the navigation to complete.
 *
 * @returns {Promise<void>} Resolves when the dashboard URL is detected.
 */
async waitForDashboardURL(): Promise<void> {
  await this.waitForURL(/dashboard/g, 900_000);
}

/**
 * Validates that the current browser URL matches the dashboard route.
 * Uses Playwright assertion to confirm the URL contains "dashboard".
 *
 * @returns {Promise<void>} Resolves if the URL validation passes, otherwise throws an error.
 */
async validateDashboardURL(): Promise<void> {
  await this.validateURL(/dashboard/g);
}

}