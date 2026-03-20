import { Locator, Page } from "playwright/test";
import { BasePage } from "./BasePage";
export class LeftNavigationPage extends BasePage{
     protected page: Page;
     private readonly pimLink: Locator;
     private readonly orangehrmLogo: Locator;
        
      constructor(page: Page) {
        super(page);
        this.page= page;

        this.pimLink=this.page.getByText('PIM');
        this.orangehrmLogo= this.page.getByRole('link', {name: 'client brand banner'});


      }

      /**
 * Opens the PIM module by clicking on the PIM link in the navigation menu.
 *
 * @returns {Promise<void>} Resolves when the PIM module is opened successfully.
 */
public async openPimModule(): Promise<void> {
  await this.clickOnElement(this.pimLink);
}

/**
 * Validates the screenshot of the OrangeHRM logo element.
 * Compares the current logo screenshot with the stored baseline snapshot.
 *
 * @param {string} screenshotFileName - The name of the screenshot file used for comparison.
 * @returns {Promise<void>} Resolves if the screenshot matches the baseline snapshot.
 */
public async validateScreenshotOfLogo(screenshotFileName: string): Promise<void> {
  await this.validateLocatorScreenshot(this.orangehrmLogo, screenshotFileName);
}




    
    
}