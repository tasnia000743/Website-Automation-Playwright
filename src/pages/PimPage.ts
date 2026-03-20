import { Locator, Page } from "playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page Object Model class for the PIM (Personnel Information Management) module.
 * Contains locators and methods for interacting with the PIM page, including adding employees
 * and validating required field messages.
 */
export class PimPage extends BasePage {
    protected page: Page;
    private readonly addEmployeeBtn: Locator;
    private readonly firstNameTextBox: Locator;
    private readonly middleNameTextBox: Locator;
    private readonly lastNameTextBox: Locator;
    private readonly saveBtn: Locator;
    private readonly newEmployeeNameHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addEmployeeBtn = this.page.getByRole('button', { name: ' Add' });
        this.firstNameTextBox = this.page.getByRole('textbox', { name: 'First Name' });
        this.middleNameTextBox = this.page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameTextBox = this.page.getByRole('textbox', { name: 'Last Name' });
        this.saveBtn = this.page.getByRole('button', { name: 'Save' });
        this.newEmployeeNameHeading = this.page.locator('.orangehrm-edit-employee-name');
    }

    /**
     * Clicks on the "Add Employee" button on the PIM page.
     *
     * @returns {Promise<void>} Resolves when the button has been clicked.
     */
    public async clickOnAddEmployeeBtn(): Promise<void> {
        await this.clickOnElement(this.addEmployeeBtn);
    }

    /**
     * Adds a new employee by filling first, middle, and last name fields and saving.
     *
     * @param firstName - Employee's first name.
     * @param middleName - Employee's middle name.
     * @param lastName - Employee's last name.
     * @returns {Promise<void>} Resolves when the employee is successfully added.
     */
    public async addEmployee(firstName: string, middleName: string, lastName: string): Promise<void> {
        await this.clickOnAddEmployeeBtn();
        await this.fillInput(this.firstNameTextBox, firstName);
        await this.fillInput(this.middleNameTextBox, middleName);
        await this.fillInput(this.lastNameTextBox, lastName);
        await this.clickOnElement(this.saveBtn);
    }

    /**
     * Gets the locator for the "required" error message span for a specific input field.
     *
     * @param fieldName - Placeholder text of the input field.
     * @returns {Locator} Locator for the required field error message.
     */
    private getRequiredMessageLocator(fieldName: string): Locator {
        return this.page.locator(
            `//input[contains(@placeholder, "${fieldName}")]
             /ancestor::div[contains(@class, "input-field")][1]
             //span[contains(@class, 'error-message')]`
        );
    }

    /**
     * Clears the first and last name input fields on the PIM page and clicks "Save".
     *
     * @param timeout - Optional timeout in milliseconds for clearing fields.
     * @returns {Promise<void>} Resolves when fields are cleared and save is clicked.
     */
    public async clearRequiredFieldsOnPimPage(timeout?: number): Promise<void> {
        await this.clearInputField(this.firstNameTextBox, timeout);
        await this.clearInputField(this.lastNameTextBox, timeout);
        await this.clickOnElement(this.saveBtn);
    }

    /**
     * Validates that the "Required" error messages are shown for first and last name fields.
     *
     * @returns {Promise<void>} Resolves when both required field messages are correctly displayed.
     */
    public async validateRequiredFieldMessageOnPimPage(): Promise<void> {
        await this.validateTextEquals(this.getRequiredMessageLocator('First Name'), 'Required');
        await this.validateTextEquals(this.getRequiredMessageLocator('Last Name'), 'Required');
    }

    /**
     * Validates the heading that displays the newly added employee's full name.
     *
     * @param newEmployeeName - Expected full name of the newly added employee.
     * @returns {Promise<void>} Resolves when the heading matches the expected employee name.
     */
    public async validateNewEmployeeNameHeading(newEmployeeName: string): Promise<void> {
        await this.validateTextEquals(this.newEmployeeNameHeading, newEmployeeName);
    }
}