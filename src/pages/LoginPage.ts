import { defineConfig, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';


/**
 * Page Object Model class for Login Module
 * Contains methods, locators specific to the login page
 */
 
export  class LoginPage extends BasePage { 
    private readonly usernameInput: Locator;
    protected readonly page:Page; //child class cant reduce the visibility of the parent class member
    private readonly passwordInput:Locator;
    private readonly loginBtn: Locator;
    private  readonly logo :Locator;
    private readonly loginPanelHeading: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly invalidCredsErrorPopup: Locator;
  
    constructor(page: Page) {
        super(page);
        this.page= page;
      
       this.usernameInput = this.page.locator('input[name="username"]');
       this.passwordInput = this.page.locator('input[name="password"]');
       this.loginBtn = this.page.getByRole('button', { name: 'Login'});
        this.logo= this.page.locator("//*[local-name()='img' and contains (@src, 'logo')]");
        this.loginPanelHeading= this.page.locator("#logInPanelHeading");
        this.forgotPasswordLink= this.page.locator("//*[local-name()='a' and contains(@href, 'symfony')]");
        this.invalidCredsErrorPopup=this.page.getByRole("alert");
        
    }
/**
 * Navigates to the login page using the BASE_URL environment variable.
 *
 * @returns {Promise<void>} Resolves when the login page is loaded.
 */
public async navigateToLoginPage(): Promise<void> {
    await this.navigateToPage(process.env.BASE_URL! + "/web/index.php/auth/login", 900_000);
}

/**
 * Clicks on the login button on the login page.
 *
 * @returns {Promise<void>} Resolves when the login button is clicked.
 */
public async clickOnLoginButton(): Promise<void> {
    await this.clickOnElement(this.loginBtn, true);
}

/**
 * Logs into the application using provided username and password.
 *
 * @param username - Username for login.
 * @param password - Password for login.
 * @returns {Promise<void>} Resolves when login process completes.
 */
public async loginToApp(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username, false);
    await this.fillInput(this.passwordInput, password, false);
    await this.clickOnLoginButton();
}

/**
 * Validates the error popup message when invalid credentials are used.
 *
 * @param invalidCredsText - Expected text or regex of the invalid credentials error popup.
 * @returns {Promise<void>} Resolves if the error message matches the expectation.
 */
public async validateInavlidCredsErrorPopup(invalidCredsText: string | RegExp): Promise<void> {
    await this.validateTextEquals(this.invalidCredsErrorPopup, invalidCredsText);
}

/**
 * Gets the locator for the "required" error message span associated with a specific input field.
 *
 * @param fieldLabel - The label of the input field.
 * @returns {Locator} Locator for the required field error message.
 */
private getRequiredTagLocatorForInputField(fieldLabel: string): Locator {
    return this.page.locator(
        `//label[contains(@class,"oxd-label") and normalize-space(text())="${fieldLabel}"]/ancestor::div[contains(@class, "input-field")]//span[contains(@class, "input-group__message")]`
    );
}

/**
 * Validates that the required field errors are shown for username and password fields on the login page.
 *
 * @returns {Promise<void>} Resolves when both required field error messages are correctly displayed.
 */
public async validateRequiredFieldErrorsOnLoginPage(): Promise<void> {
    const requiredForUsername = this.getRequiredTagLocatorForInputField("Username");
    const requiredForPassword = this.getRequiredTagLocatorForInputField("Password");
    await this.validateTextEquals(requiredForUsername, "Required");
    await this.validateTextEquals(requiredForPassword, "Required");
}

/**
 * Clears both username and password input fields on the login page.
 *
 * @param timeout - Optional timeout in milliseconds for clearing the fields.
 * @returns {Promise<void>} Resolves when both fields are cleared.
 */
public async clearUserNameAndPasswordField(timeout?: number): Promise<void> {
    await this.clearInputField(this.usernameInput, timeout);
    await this.clearInputField(this.passwordInput, timeout);
}

}