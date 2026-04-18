import { chromium, BrowserContext } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { CommonUtils } from "@/utils/CommonUtils";
import { DashboardPage } from "@/pages/DashboardPage";

export default async function globalSetup() {

  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext();
  const page = await context.newPage();

  const login = new LoginPage(page);
  const dashboard= new DashboardPage(page);
  const util= new CommonUtils();
  const decryptedUser= util.getDecryptedData(process.env.USER_NAME!);
  const decryptedPass= util.getDecryptedData(process.env.PASSWORD!);
  console.log("Decrypted username: ", decryptedUser);
  console.log("Decrypted password: ", decryptedPass);

  await login.navigateToLoginPage();
  await login.loginToApp(decryptedUser, decryptedPass);

  // Wait for successful login and dashboard navigation
  await dashboard.waitForDashboardURL();
  // Store authenticated session state (cookies, local storage, etc.)
  await context.storageState({ path: "auth.json" });

  await browser.close();
}
