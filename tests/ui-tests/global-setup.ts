import { chromium, BrowserContext } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { CommonUtils } from "@/utils/CommonUtils";
import { DashboardPage } from "@/pages/DashboardPage";
import crypto from "crypto";

export default async function globalSetup() {

  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext();
  const page = await context.newPage();

  const login = new LoginPage(page);
  const dashboard= new DashboardPage(page);
  const util= new CommonUtils();

const user = crypto
  .createHash("sha256")
  .update(process.env.USER_NAME!)
  .digest("hex");

  const pass = crypto
  .createHash("sha256")
  .update(process.env.PASSWORD!)
  .digest("hex");

  console.log("en username: ", user);
  console.log("en password: ", pass);

  await login.navigateToLoginPage();
  await login.loginToApp(process.env.USER_NAME!, process.env.PASSWORD!);

  // Wait for successful login and dashboard navigation
  await dashboard.waitForDashboardURL();
  // Store authenticated session state (cookies, local storage, etc.)
  await context.storageState({ path: "auth.json" });

  await browser.close();
}
