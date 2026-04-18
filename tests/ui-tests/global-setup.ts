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

  console.log("en username: ", String(process.env.USER_NAME));
  console.log("en password: ", String(process.env.PASSWORD));

  await login.navigateToLoginPage();
  await login.loginToApp(process.env.USER_NAME!, process.env.PASSWORD!);

  // Wait for successful login and dashboard navigation
  await dashboard.waitForDashboardURL();
  // Store authenticated session state (cookies, local storage, etc.)
  await context.storageState({ path: "auth.json" });

  await browser.close();
}
