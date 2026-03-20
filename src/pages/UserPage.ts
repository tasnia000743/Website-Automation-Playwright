import { Locator, Page } from "playwright/test";
import { BasePage } from "./BasePage";

export class UserPage extends BasePage {
    private readonly userMenuBtn: Locator;
    protected page: Page;
    private logoutBTn: Locator;

    constructor (page: Page) {
        super(page);
        this.page= page;
        this.userMenuBtn= this.page.locator("//i[contains(@class,  'caret-down')]");
        this.logoutBTn=this.page.getByRole("menuitem", {name: 'Logout'});


    }
 

    async logout(): Promise<void>  {
        await this.clickOnElement(this.userMenuBtn);
        await this.clickOnElement(this.logoutBTn);
    }



}