# Playwright Website Automation 🚀

[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.42+-blue)](https://playwright.dev/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/playwright-automation/ci.yml?branch=main)](https://github.com/yourusername/playwright-automation/actions)

Automated web testing project using **Playwright**, built with a **layered architecture** to ensure maintainable and scalable automation.  
Implements **Page Object Model (POM) with Singleton pattern** and **Strategy pattern for test data management**.

---

## Features ✨

- Cross-browser automation: Chrome, Firefox, Safari (WebKit)  
- **Layered architecture**:
  - **Page Layer** – POM + Singleton for reusable page methods  
  - **Test Layer** – automated test scripts  
  - **Data Layer** – Strategy pattern for dynamic test data
  - **Util Layer** – fetches data from APIs, helper utilities, and log file generation for better debugging and reporting
- Automates user actions: login, form submissions, navigation  
- Validates UI elements and page content  
- Measures basic performance metrics  
- Easy to extend with new tests

---

## Folder Structure 📁
- **tests/** – Test scripts written in TypeScript (.ts)  
- **pages/** – Page Object Model (POM) classes (.ts)  
- **data/** – Test data management (Strategy pattern)  
- **utils/** – Utility functions, API helpers, handling log files
- **reports/** – Generated test reports
- **logfiles/**- Generated log files
- **tsconfig.json** – TypeScript configuration file  
- **playwright.config.ts** – Playwright configuration file





