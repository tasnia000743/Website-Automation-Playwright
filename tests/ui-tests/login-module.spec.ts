import { DataReaderFactory } from '@/data/DataReaderFactory';
import {test} from '../../fixture/hooks-fixture';

test.describe("Login Module Tests", ()=> {
  test.use({
    storageState: {
      cookies: [],
      origins: []

    }
  })

  // test.beforeEach('Before each hook', async ({login,})=> {
  //      await login.navigateToLoginPage();

  // });

  // test.afterEach('After each hook', async ({userPage})=> {
  //      await userPage.logout();

  // });

  test("Login01-Verify login to Application with valid credentials",
    {tag: ['@UI', '@UAT']}, async ({login, common, dashboard, goToLoginURL})=> {
  const username = common.getDecryptedData(String(process.env.USER_NAME));
  const password = common.getDecryptedData(String(process.env.PASSWORD));
      await login.loginToApp(username, password);
      await dashboard.validateDashboardURL();
      
  });

  test.skip("Login02-Verify login to Application with invalid password", {tag: ['@UI', '@UAT']}, async ({login, page, goToLoginURL, common})=> {
    const validUser = common.getDecryptedData(process.env.USER_NAME!);
    const jsonData= await DataReaderFactory.readData("./test-data/ui-data/login-module-data.json");
      await login.loginToApp(validUser,jsonData[0].wrong_password);
      await login.validateInavlidCredsErrorPopup(jsonData[0].invalid_credentialstext);
      

  });

  test.skip("Login03-Verify login to Application with invalid username", async ({login, page, goToLoginURL, common})=> {
    const validPass = common.getDecryptedData(process.env.PASSWORD!);
    const jsonData= await DataReaderFactory.readData("./test-data/ui-data/login-module-data.json");
      await login.loginToApp(jsonData[0].wrong_username, validPass);
      await login.validateInavlidCredsErrorPopup(jsonData[0].invalid_credentialstext);
      

  });

   test.skip("Login04-Verify login to Application with invalid username & invalid password", async ({login, page, goToLoginURL})=> {
    const jsonData= await DataReaderFactory.readData("./test-data/ui-data/login-module-data.json");
      await login.loginToApp(jsonData[0].wrong_username, jsonData[0].wrong_password);
      await login.validateInavlidCredsErrorPopup(jsonData[0].invalid_credentialstext);
      

  });

  test.skip("Login05-Verify that input fields get highlighted with 'Required' tag when required fields are left empty while logging in", async ({login, goToLoginURL})=> {
    await login.clearUserNameAndPasswordField();
    await login.clickOnLoginButton();
    await login.validateRequiredFieldErrorsOnLoginPage();

  });

   test("Login06- Verify that on the dashboard, after the login the logo is properly visible",
    {tag: '@Visual'}, async ({login, common, dashboard, goToLoginURL, leftNavigationPage})=> {
  const username = common.getDecryptedData(String(process.env.USER_NAME));
  const password = common.getDecryptedData(String(process.env.PASSWORD));
      await login.loginToApp(username, password);
      await dashboard.validateDashboardURL();
      await leftNavigationPage.validateScreenshotOfLogo('orangehrmlogo.png');

      
  });

});

