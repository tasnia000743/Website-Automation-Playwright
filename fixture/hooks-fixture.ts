import { test as baseTest } from "../fixture/pom-common-fixture";

type hookFixture = {
    goToLoginURL: void; // or you can type properly
    logout: void;
}

export const test = baseTest.extend<hookFixture>({
    goToLoginURL: async ({ login }, use) => {
        await login.navigateToLoginPage();
        await use(); //before each
    },
    logout: async ({ userPage }, use) => {
        await use(); 
        await userPage.logout();
    }
});

export {expect} from '@playwright/test';

