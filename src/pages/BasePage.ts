import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/LogerUtils';

const LOG_CONTEXT = 'BasePage';

/**
 * Base Page Object Model class
 * Contains common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
    logger.info('BasePage initialized', LOG_CONTEXT);
  }

  /**
   * Navigates to the page URL
   */
  async navigateToPage(url: string, timeout?: number, loadingSpinner: boolean = true): Promise<void> {
    logger.info(`Navigating to page: ${url}`, LOG_CONTEXT);
    try {
      await this.page.goto(url, { timeout });
      if (loadingSpinner) {
        await this.waitForPageLoad(timeout);
        await this.waitForLoaderToStop();
      }
      logger.info(`Navigation completed: ${url}`, LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('navigateToPage', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Gets the page title
   * @returns Promise resolving to page title
   */
  async getTitle(): Promise<string> {
    logger.debug('Getting page title', LOG_CONTEXT);
    try {
      const title = await this.page.title();
      logger.debug(`Page title: ${title}`, LOG_CONTEXT);
      return title;
    } catch (err) {
      logger.logMethodError('getTitle', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Gets the current URL
   * @returns Promise resolving to current URL
   */
  async getCurrentUrl(): Promise<string> {
    logger.debug('Getting current URL', LOG_CONTEXT);
    try {
      const url = this.page.url();
      logger.debug(`Current URL: ${url}`, LOG_CONTEXT);
      return url;
    } catch (err) {
      logger.logMethodError('getCurrentUrl', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Waits for page to load completely
   */
  private async waitForPageLoad(timeout?: number): Promise<void> {
    logger.debug(`Waiting for page load (timeout: ${timeout ?? 'default'})`, LOG_CONTEXT);
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Takes a screenshot
   * @param name Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    logger.info(`Taking screenshot: ${name}`, LOG_CONTEXT);
    try {
      await this.page.screenshot({ path: `screenshots/${name}.png` });
      logger.info(`Screenshot saved: ${name}.png`, LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('takeScreenshot', err, LOG_CONTEXT);
      throw err;
    }
  }



  /**
   * Waits for element to be visible
   * @param locator Element locator
   * @param timeout Timeout in milliseconds
   */
  public async waitForElementToBeVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Clicks an element 
   * @param locator Element locator
   * @param timeout Timeout in milliseconds
   */
  async clickOnElement(locator: Locator, isLoader:boolean=true, timeout?: number): Promise<void> {
    await this.waitForElementToBeVisible(locator, timeout);
    await locator.click({ timeout });
    if(isLoader) {
      await this.waitForPageLoad(timeout);
      await this.waitForLoaderToStop();
    }
  }
private async waitForLoaderToStop(waitTimeForLoaderToAppear: number = 3000): Promise<void> {

  const waitForLoader = async (waitTime: number): Promise<void> => {
     const loader = this.page.locator(".oxd-loading-spinner");
    const count = await loader.count();
    if (count === 0) {
      if (waitTime !== 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      await waitForLoader(0);
      } 
      else {
        return;
      }
    } 
    else {
      await new Promise(resolve => setTimeout(resolve, 500));
       await waitForLoader(0);
    }

  };

  await waitForLoader(waitTimeForLoaderToAppear);
}

  /**
   * Fills input field
   * @param locator Input locator
   * @param value Value to fill
   */
  async fillInput(locator: Locator, value: string, isLoader: boolean = true, timeout?: number, isClear: boolean = true): Promise<void> {
    logger.info(`Filling input (isClear: ${isClear}, isLoader: ${isLoader})`, LOG_CONTEXT);
    try {
      await this.waitForElementToBeVisible(locator, timeout);
      if (isClear) {
        await locator.clear();
      }
      await locator.fill(value, { timeout });
      if (isLoader) {
        await this.waitForPageLoad(timeout);
      }
      logger.info('Input filled successfully', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('fillInput', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Gets text from element
   * @param locator Element locator
   */
  async getTextFromElement(locator: Locator): Promise<string> {
    logger.debug('Getting text from element', LOG_CONTEXT);
    try {
      const text = await locator.innerText();
      logger.debug(`Element text length: ${text?.length ?? 0}`, LOG_CONTEXT);
      return text;
    } catch (err) {
      logger.logMethodError('getTextFromElement', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Gets attribute value from element
   * @param locator Element locator
   * @param attributeName Attribute name whose value will be retrieved
   */
  async getAttributeValueOfAnElement(locator: Locator, attributeName: string): Promise<string | null> {
    logger.debug(`Getting attribute '${attributeName}' from element`, LOG_CONTEXT);
    try {
      const value = await locator.evaluate((el) => el.getAttribute(attributeName));
      logger.debug(`Attribute '${attributeName}' retrieved`, LOG_CONTEXT);
      return value;
    } catch (err) {
      logger.logMethodError('getAttributeValueOfAnElement', err, LOG_CONTEXT);
      throw err;
    }
  }



  /**
   * Waits for the locator to be visible within an optional timeout
   */
  async validateVisible(locator: Locator, timeout?: number): Promise<void> {
    logger.debug('Validating element visible', LOG_CONTEXT);
    try {
      await expect(locator).toBeVisible({ timeout });
      logger.debug('Element is visible', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateVisible', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator is hidden (not visible)
   */
  async validateHidden(locator: Locator, timeout?: number): Promise<void> {
    logger.debug('Validating element hidden', LOG_CONTEXT);
    try {
      await expect(locator).toBeHidden({ timeout });
      logger.debug('Element is hidden', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateHidden', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator's text equals the expected text
   */
  async validateTextEquals(locator: Locator, expectedText: string | RegExp, timeout?: number): Promise<void> {
    logger.debug(`Validating text equals: ${String(expectedText)}`, LOG_CONTEXT);
    try {
      await expect(locator).toHaveText(expectedText, { timeout });
      logger.debug('Text validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateTextEquals', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator's text contains the expected substring
   */
  async validateTextContains(locator: Locator, expectedSubstring: string | RegExp, timeout?: number): Promise<void> {
    logger.debug(`Validating text contains: ${String(expectedSubstring)}`, LOG_CONTEXT);
    try {
      await expect(locator).toContainText(expectedSubstring, { timeout });
      logger.debug('Text contains validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateTextContains', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator has the specified attribute value
   */
  async validateAttributeEquals(locator: Locator, attributeName: string, expectedValue: string | RegExp, timeout?: number): Promise<void> {
    logger.debug(`Validating attribute '${attributeName}' equals: ${String(expectedValue)}`, LOG_CONTEXT);
    try {
      await expect(locator).toHaveAttribute(attributeName, expectedValue, { timeout });
      logger.debug('Attribute validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateAttributeEquals', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator has the specified property value
   */
  async validatePropertyEquals(locator: Locator, propertyName: string, expectedValue: boolean, timeout?: number): Promise<void> {
    logger.debug(`Validating property '${propertyName}' equals: ${expectedValue}`, LOG_CONTEXT);
    try {
      await expect(locator).toHaveJSProperty(propertyName, expectedValue, { timeout });
      logger.debug('Property validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validatePropertyEquals', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the input/element value equals expected
   */
  async validateValueEquals(locator: Locator, expectedValue: string | RegExp, timeout?: number): Promise<void> {
    logger.debug(`Validating value equals: ${String(expectedValue)}`, LOG_CONTEXT);
    try {
      await expect(locator).toHaveValue(expectedValue, { timeout });
      logger.debug('Value validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateValueEquals', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator is enabled
   */
  async validateEnabled(locator: Locator, timeout?: number): Promise<void> {
    logger.debug('Validating element enabled', LOG_CONTEXT);
    try {
      await expect(locator).toBeEnabled({ timeout });
      logger.debug('Element is enabled', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateEnabled', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator is disabled
   */
  async validateDisabled(locator: Locator, timeout?: number): Promise<void> {
    logger.debug('Validating element disabled', LOG_CONTEXT);
    try {
      await expect(locator).toBeDisabled({ timeout });
      logger.debug('Element is disabled', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateDisabled', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator (checkbox/radio) is checked
   */
  async validateChecked(locator: Locator, timeout?: number): Promise<void> {
    logger.debug('Validating element checked', LOG_CONTEXT);
    try {
      await expect(locator).toBeChecked({ timeout });
      logger.debug('Element is checked', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateChecked', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the locator (checkbox/radio) is unchecked
   */
  async validateUnChecked(locator: Locator, timeout?: number): Promise<void> {
    logger.debug('Validating element unchecked', LOG_CONTEXT);
    try {
      await expect(locator).not.toBeChecked({ timeout });
      logger.debug('Element is unchecked', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateUnChecked', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the number of matching elements equals expected count
   */
  async validateCount(locator: Locator, expectedCount: number, timeout?: number): Promise<void> {
    logger.debug(`Validating element count equals: ${expectedCount}`, LOG_CONTEXT);
    try {
      await expect(locator).toHaveCount(expectedCount, { timeout });
      logger.debug('Count validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateCount', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Asserts the element's `class` attribute contains a class name
   */
  async validateClassContains(locator: Locator, className: string, timeout?: number): Promise<void> {
    logger.debug(`Validating class contains: ${className}`, LOG_CONTEXT);
    try {
      const regex = new RegExp(`(^|\\s)${className}($|\\s)`);
      await expect(locator).toHaveClass(regex, { timeout });
      logger.debug('Class validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateClassContains', err, LOG_CONTEXT);
      throw err;
    }
  }

  /**
   * Waits for URL to match
   */
  async waitForURL(url: string | RegExp, timeout?: number): Promise<void> {
    logger.info(`Waiting for URL: ${String(url)}`, LOG_CONTEXT);
    try {
      await this.page.waitForURL(url, { timeout });
      logger.info('URL matched', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('waitForURL', err, LOG_CONTEXT);
      throw err;
    }
  }

  async validateURL(url: string | RegExp): Promise<void> {
    logger.debug(`Validating URL: ${String(url)}`, LOG_CONTEXT);
    try {
      await expect(this.page).toHaveURL(url);
      logger.debug('URL validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateURL', err, LOG_CONTEXT);
      throw err;
    }
  }

  async clearInputField(locator: Locator, timeout?: number): Promise<void> {
    logger.info('Clearing input field', LOG_CONTEXT);
    try {
      await locator.clear({ timeout });
      logger.info('Input field cleared', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('clearInputField', err, LOG_CONTEXT);
      throw err;
    }
  }

  async validateFullPageScreenshot(screenShotFileName: string): Promise<void> {
    logger.info(`Validating full page screenshot: ${screenShotFileName}`, LOG_CONTEXT);
    try {
      await expect(this.page).toHaveScreenshot(screenShotFileName, { fullPage: true });
      logger.info('Full page screenshot validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateFullPageScreenshot', err, LOG_CONTEXT);
      throw err;
    }
  }

  async validateLocatorScreenshot(locator: Locator, screenShotFileName: string): Promise<void> {
    logger.info(`Validating locator screenshot: ${screenShotFileName}`, LOG_CONTEXT);
    try {
      await expect(locator).toHaveScreenshot(screenShotFileName);
      logger.info('Locator screenshot validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateLocatorScreenshot', err, LOG_CONTEXT);
      throw err;
    }
  }

  async validateTextScreenshot(locator: Locator, screenShotFileName: string): Promise<void> {
    logger.info(`Validating text snapshot: ${screenShotFileName}`, LOG_CONTEXT);
    try {
      expect(await locator.textContent()).toMatchSnapshot(screenShotFileName);
      logger.info('Text screenshot validation passed', LOG_CONTEXT);
    } catch (err) {
      logger.logMethodError('validateTextScreenshot', err, LOG_CONTEXT);
      throw err;
    }
  }





  

}
