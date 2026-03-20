import { test} from "fixture/hooks-fixture";


test.describe("PIM Module Tests", ()=> {

  // test.beforeEach('Before each hook', async ({login,})=> {
  //      await login.navigateToLoginPage();

  // });

  // test.afterEach('After each hook', async ({userPage})=> {
  //      await userPage.logout();

  // });

  test("PIM01-Verify that a new employee can be created in PIM Module ",{tag: ['@UI', '@UAT']}, async ({goToLoginURL, common, leftNavigationPage, pimPage})=> {
  await test.step("Open the PIM module", async()=> {
  await leftNavigationPage.openPimModule();
  });
  await test.step("Add a new employee", async()=> {
  const firstName= common.getRandomValue(10, true);
  const midName= common.getRandomValue();
  const lastName= common.getRandomValue();
  await pimPage.addEmployee(firstName, midName, lastName);
  await pimPage.validateNewEmployeeNameHeading(`${firstName} ${lastName}`);
  });

  });

  test("PIM02-Verify that the required fields of add new employee page are highlighted with 'Required' tag when those fields are left empty ", async ({goToLoginURL, leftNavigationPage, pimPage})=> {
  await leftNavigationPage.openPimModule();
  await pimPage.clickOnAddEmployeeBtn();
  await pimPage.clearRequiredFieldsOnPimPage();
  await pimPage.validateRequiredFieldMessageOnPimPage();
  
  });
      
  });




