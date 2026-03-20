# Website Automation with Playwright - Layered Architecture

A comprehensive Playwright automation framework implementing **Page Object Model (POM)** and **Strategy Pattern** for data-driven testing with support for CSV, Excel, and JSON data sources.

## 🏗️ Architecture Overview

This project follows a **layered architecture** with clear separation of concerns:

```
src/
├── data/                    # Data Layer (Strategy Pattern)
│   ├── interfaces/         # Data reader interfaces
│   ├── strategies/         # Concrete data readers (CSV, Excel, JSON)
│   └── DataReaderFactory.ts # Factory for data readers
├── pages/                   # Page Object Model Layer
│   ├── BasePage.ts         # Base page class
│   ├── PlaywrightHomePage.ts # Specific page objects
│   └── InstallationPage.ts
├── utils/                   # Utilities Layer
│   ├── TestUtils.ts        # Test utilities
│   ├── BrowserUtils.ts     # Browser utilities
│   └── FileUtils.ts        # File operations
└── config/                  # Configuration Layer
    ├── TestConfig.ts       # Test configuration
    └── TestDataTypes.ts    # Type definitions

tests/
├── base/                   # Base test classes
├── smoke-tests.spec.ts     # Smoke tests
├── playwright-docs-data-driven.spec.ts # Data-driven tests
└── cross-browser-tests.spec.ts # Cross-browser tests

test-data/                   # Test data files
├── users.csv              # User data
├── products.csv           # Product data
├── test-cases.json        # Test case data
└── excel-test-data.json   # Excel test data
```

## 🚀 Features

- **Page Object Model (POM)**: Clean separation of page logic and test logic
- **Strategy Pattern**: Flexible data reading from CSV, Excel, and JSON files
- **Data-Driven Testing**: Support for multiple data sources
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge, and Mobile
- **Parallel Execution**: Optimized for CI/CD pipelines
- **Comprehensive Reporting**: HTML, JSON, and JUnit reports
- **TypeScript Support**: Full type safety and IntelliSense
- **Utility Functions**: Common test operations and browser utilities
- **Configuration Management**: Environment-based configuration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Website-Automation-Playwright
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

## 🧪 Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### Specific Test Suites
```bash
# Run smoke tests only
npm run test:smoke

# Run data-driven tests
npm run test:data-driven

# Run cross-browser tests
npm run test:cross-browser
```

### Browser-Specific Tests
```bash
# Run tests on specific browsers
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

### Reporting
```bash
# View test report
npm run test:report

# View trace for failed tests
npm run trace
```

## 📊 Data-Driven Testing

The framework supports reading test data from multiple sources:

### CSV Files
```typescript
// Read user data from CSV
const userData = await DataReaderFactory.readData('./test-data/users.csv');
```

### JSON Files
```typescript
// Read test cases from JSON
const testCases = await DataReaderFactory.readData('./test-data/test-cases.json');
```

### Excel Files
```typescript
// Read data from Excel
const excelData = await DataReaderFactory.readData('./test-data/data.xlsx');
```

## 🏗️ Page Object Model

### Base Page Class
```typescript
export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
  // ... other common methods
}
```

### Specific Page Classes
```typescript
export class PlaywrightHomePage extends BasePage {
  private readonly getStartedLink: Locator;

  constructor(page: Page) {
    super(page, 'https://playwright.dev/');
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async clickGetStarted(): Promise<void> {
    await this.clickWithRetry(this.getStartedLink);
  }
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```env
# Test Environment
ENVIRONMENT=dev
BASE_URL=https://playwright.dev

# Browser Settings
HEADLESS=false
SLOW_MO=0
BROWSER=chromium

# Test Settings
TIMEOUT=30000
RETRY_COUNT=2
PARALLEL_WORKERS=1
```

### Test Configuration
```typescript
export class TestConfig {
  static readonly BASE_URL = process.env.BASE_URL || 'https://playwright.dev';
  static readonly HEADLESS = process.env.HEADLESS === 'true';
  static readonly TIMEOUT = parseInt(process.env.TIMEOUT || '30000');
  // ... other configurations
}
```

## 🛠️ Utilities

### Test Utilities
```typescript
// Generate random data
const randomEmail = TestUtils.generateRandomEmail();
const randomString = TestUtils.generateRandomString(10);

// Date formatting
const formattedDate = TestUtils.formatDate(new Date(), 'YYYY-MM-DD');
```

### Browser Utilities
```typescript
// Clear browser data
await BrowserUtils.clearStorage(page);
await BrowserUtils.clearCookies(context);

// Take screenshots
await BrowserUtils.takeFullPageScreenshot(page, 'test-screenshot');

// Performance metrics
const metrics = await BrowserUtils.getPerformanceMetrics(page);
```

### File Utilities
```typescript
// File operations
FileUtils.createDirectory('./screenshots');
const fileContent = FileUtils.readFile('./test-data/users.csv');
const fileExists = FileUtils.fileExists('./test-data/test.json');
```

## 📈 Reporting

The framework generates multiple report formats:

- **HTML Report**: Interactive test results with screenshots and traces
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration compatible

Reports are saved in the `test-results/` directory.

## 🔍 Debugging

### Trace Viewer
```bash
npm run trace
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

## 🚀 CI/CD Integration

The framework is optimized for CI/CD pipelines:

- **Parallel execution** for faster test runs
- **Retry mechanism** for flaky tests
- **Multiple report formats** for different tools
- **Environment-based configuration**

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

## 📝 Best Practices

1. **Use Page Objects**: Keep page logic separate from test logic
2. **Data-Driven Tests**: Use external data sources for test data
3. **Wait Strategies**: Use proper wait strategies instead of hard waits
4. **Error Handling**: Implement proper error handling and retry mechanisms
5. **Cleanup**: Always clean up test data and browser state
6. **Reporting**: Use comprehensive reporting for better visibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Check the Playwright documentation
- Review the test examples in the `tests/` directory