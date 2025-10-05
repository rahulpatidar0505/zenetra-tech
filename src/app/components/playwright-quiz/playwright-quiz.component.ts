import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
  explanation: string;
}

@Component({
  selector: 'app-playwright-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playwright-quiz.component.html',
  styleUrls: ['./playwright-quiz.component.scss']
})
export class PlaywrightQuizComponent {
  
  // Quiz state
  quizAnswers: { [key: string]: string } = {};
  showResults = false;
  expandedQuizModules: { [key: string]: boolean } = {
    'module1': true,  // Start with first module expanded
    'module2': false,
    'module3': false,
    'module4': false,
    'module5': false,
    'module6': false,
    'module7': false,
    'module8': false
  };
  
  // Quiz questions and correct answers
  correctAnswers: { [key: string]: string } = {
    // Module 1: Playwright Foundations (Extended)
    'q1_1': 'c', 'q1_2': 'b', 'q1_3': 'a', 'q1_4': 'd', 'q1_5': 'c',
    'q1_6': 'b', 'q1_7': 'c', 'q1_8': 'd', 'q1_9': 'a', 'q1_10': 'b',
    'q1_11': 'c', 'q1_12': 'd', 'q1_13': 'a', 'q1_14': 'b', 'q1_15': 'c',
    
    // Module 2: JavaScript for Playwright  
    'q2_1': 'c', 'q2_2': 'b', 'q2_3': 'b', 'q2_4': 'c', 'q2_5': 'c',
    
    // Module 3: Playwright Essentials
    'q3_1': 'c', 'q3_2': 'b', 'q3_3': 'b', 'q3_4': 'b', 'q3_5': 'c',
    
    // Module 4: Page Object Model & Best Practices
    'q4_1': 'c', 'q4_2': 'c', 'q4_3': 'b', 'q4_4': 'd', 'q4_5': 'b',
    
    // Module 5: API Testing with Playwright
    'q5_1': 'c', 'q5_2': 'c', 'q5_3': 'b', 'q5_4': 'c', 'q5_5': 'a',
    
    // Module 6: Advanced Features
    'q6_1': 'c', 'q6_2': 'b', 'q6_3': 'b', 'q6_4': 'c', 'q6_5': 'b',
    
    // Module 7: Cross-browser Testing & CI/CD
    'q7_1': 'b', 'q7_2': 'c', 'q7_3': 'a', 'q7_4': 'd', 'q7_5': 'b',
    
    // Module 8: Performance & Debugging
    'q8_1': 'c', 'q8_2': 'a', 'q8_3': 'b', 'q8_4': 'b', 'q8_5': 'a'
  };

  // Quiz questions data structure
  questions = {
    module1: [
      {
        id: 'q1_1',
        question: 'What is Playwright primarily designed for?',
        options: {
          a: 'Mobile app testing only',
          b: 'API testing only',
          c: 'Web application automation and testing',
          d: 'Database testing'
        },
        correctAnswer: 'c',
        explanation: 'Playwright is a modern web automation framework designed for testing and automating web applications across multiple browsers.'
      },
      {
        id: 'q1_2',
        question: 'Which browsers does Playwright support out of the box?',
        options: {
          a: 'Only Chrome',
          b: 'Chrome, Firefox, Safari, and Edge',
          c: 'Chrome and Firefox only',
          d: 'Internet Explorer only'
        },
        correctAnswer: 'b',
        explanation: 'Playwright supports all major modern browsers including Chromium, Firefox, Safari, and Microsoft Edge.'
      },
      {
        id: 'q1_3',
        question: 'What company originally developed Playwright?',
        options: {
          a: 'Microsoft',
          b: 'Google',
          c: 'Facebook',
          d: 'Mozilla'
        },
        correctAnswer: 'a',
        explanation: 'Playwright was originally developed by Microsoft and is maintained as an open-source project.'
      },
      {
        id: 'q1_4',
        question: 'Which programming languages does Playwright support?',
        options: {
          a: 'Only JavaScript',
          b: 'JavaScript and Python only',
          c: 'JavaScript, Python, and Java only',
          d: 'JavaScript, Python, Java, C#, and more'
        },
        correctAnswer: 'd',
        explanation: 'Playwright provides bindings for multiple programming languages including JavaScript/TypeScript, Python, Java, C#, and others.'
      },
      {
        id: 'q1_5',
        question: 'What is the main advantage of Playwright over Selenium?',
        options: {
          a: 'Better mobile support',
          b: 'Smaller file size',
          c: 'Built-in wait strategies and modern browser features',
          d: 'Only works with Chrome'
        },
        correctAnswer: 'c',
        explanation: 'Playwright offers built-in intelligent wait strategies, better handling of modern web apps, and native support for modern browser features.'
      },
      {
        id: 'q1_6',
        question: 'What is Playwright\'s architecture based on?',
        options: {
          a: 'WebDriver protocol',
          b: 'Direct browser automation via DevTools Protocol',
          c: 'HTTP REST API',
          d: 'Browser extensions'
        },
        correctAnswer: 'b',
        explanation: 'Playwright uses DevTools Protocol to communicate directly with browsers, eliminating the need for browser drivers and providing faster, more reliable automation.'
      },
      {
        id: 'q1_7',
        question: 'Which locator strategy is recommended as the most reliable in Playwright?',
        options: {
          a: 'CSS selectors',
          b: 'XPath expressions',
          c: 'Text-based locators and ARIA attributes',
          d: 'ID attributes only'
        },
        correctAnswer: 'c',
        explanation: 'Playwright recommends using text-based locators and ARIA attributes as they are more resilient to UI changes and represent how users interact with the application.'
      },
      {
        id: 'q1_8',
        question: 'What types of assertions does Playwright provide?',
        options: {
          a: 'Only basic equality assertions',
          b: 'Only DOM-based assertions',
          c: 'Only network assertions',
          d: 'Web-first assertions with auto-waiting capabilities'
        },
        correctAnswer: 'd',
        explanation: 'Playwright provides web-first assertions that automatically wait for conditions to be met before asserting, making tests more reliable and eliminating flaky tests.'
      },
      {
        id: 'q1_9',
        question: 'What is Playwright\'s auto-wait mechanism?',
        options: {
          a: 'Automatic waiting for elements to be actionable before performing actions',
          b: 'Fixed delays between actions',
          c: 'Manual wait configuration required',
          d: 'No waiting mechanism available'
        },
        correctAnswer: 'a',
        explanation: 'Playwright automatically waits for elements to be actionable (visible, enabled, stable) before performing actions, eliminating the need for explicit waits in most cases.'
      },
      {
        id: 'q1_10',
        question: 'Which locator method finds elements by their accessible name?',
        options: {
          a: 'page.locator()',
          b: 'page.getByRole()',
          c: 'page.getByTestId()',
          d: 'page.getByText()'
        },
        correctAnswer: 'b',
        explanation: 'page.getByRole() locates elements by their ARIA role and accessible name, making tests more aligned with how users and assistive technologies interact with the page.'
      },
      {
        id: 'q1_11',
        question: 'What is the correct syntax for a CSS selector locator in Playwright?',
        options: {
          a: 'page.findElement("#button")',
          b: 'page.css("#button")',
          c: 'page.locator("#button")',
          d: 'page.selector("#button")'
        },
        correctAnswer: 'c',
        explanation: 'page.locator() is the primary method for creating locators in Playwright, accepting CSS selectors, XPath, and other selector strategies.'
      },
      {
        id: 'q1_12',
        question: 'Which assertion automatically waits for the condition to be true?',
        options: {
          a: 'assert(element.isVisible())',
          b: 'element.isVisible().should.be.true',
          c: 'expect(element).toBeVisible()',
          d: 'expect(await element.isVisible()).toBe(true)'
        },
        correctAnswer: 'd',
        explanation: 'expect(element).toBeVisible() is a web-first assertion that automatically waits for the element to become visible before asserting, unlike option d which checks the current state.'
      },
      {
        id: 'q1_13',
        question: 'What happens when an element is not immediately available in Playwright?',
        options: {
          a: 'Actions automatically wait up to 30 seconds for elements to become actionable',
          b: 'Test fails immediately',
          c: 'Manual wait is required',
          d: 'Element is created automatically'
        },
        correctAnswer: 'a',
        explanation: 'Playwright has a default timeout of 30 seconds and automatically waits for elements to become actionable (visible, enabled, stable) before performing actions.'
      },
      {
        id: 'q1_14',
        question: 'Which locator is best for finding elements by their visible text?',
        options: {
          a: 'page.locator("text=Login")',
          b: 'page.getByText("Login")',
          c: 'page.textContent("Login")',
          d: 'page.findByText("Login")'
        },
        correctAnswer: 'b',
        explanation: 'page.getByText() is the recommended method for locating elements by their visible text content, providing better readability and reliability.'
      },
      {
        id: 'q1_15',
        question: 'What is the benefit of Playwright\'s isolation by default?',
        options: {
          a: 'Tests run faster',
          b: 'Less memory usage',
          c: 'Each test gets a fresh browser context, preventing test interference',
          d: 'Better error messages'
        },
        correctAnswer: 'c',
        explanation: 'Playwright creates a fresh browser context for each test by default, ensuring tests are isolated and don\'t interfere with each other through shared state like cookies or localStorage.'
      }
    ],
    module2: [
      {
        id: 'q2_1',
        question: 'What is the correct syntax for an async Playwright test function?',
        options: {
          a: 'function test() { await page.goto("..."); }',
          b: 'test("my test", () => { page.goto("..."); })',
          c: 'test("my test", async ({ page }) => { await page.goto("..."); })',
          d: 'async test() { page.goto("..."); }'
        },
        correctAnswer: 'c',
        explanation: 'Playwright tests use async functions with destructured fixtures: test("name", async ({ page }) => { await page.action(); })'
      },
      {
        id: 'q2_2',
        question: 'Which JavaScript destructuring syntax extracts page and context in Playwright?',
        options: {
          a: 'const page, context = fixtures;',
          b: 'const { page, context } = fixtures;',
          c: 'const [page, context] = fixtures;',
          d: 'const page = fixtures.page, context = fixtures.context;'
        },
        correctAnswer: 'b',
        explanation: 'Object destructuring { page, context } extracts multiple fixtures from the test parameter object.'
      },
      {
        id: 'q2_3',
        question: 'How do you properly chain multiple Playwright actions in JavaScript?',
        options: {
          a: 'page.click("#btn").fill("#input", "text").press("Enter")',
          b: 'await page.click("#btn"); await page.fill("#input", "text"); await page.press("Enter");',
          c: 'page.click("#btn") && page.fill("#input", "text") && page.press("Enter")',
          d: 'page.click("#btn"), page.fill("#input", "text"), page.press("Enter")'
        },
        correctAnswer: 'b',
        explanation: 'Each Playwright action returns a Promise, so each must be awaited separately for proper execution order.'
      },
      {
        id: 'q2_4',
        question: 'What does this JavaScript code do in Playwright: `const text = await page.textContent("h1");`?',
        options: {
          a: 'Sets text content of h1 element',
          b: 'Waits for h1 element to appear',
          c: 'Gets the text content of h1 element and stores it in a variable',
          d: 'Clicks on the h1 element'
        },
        correctAnswer: 'c',
        explanation: 'This code extracts the text content from an h1 element and stores it in the text variable using await.'
      },
      {
        id: 'q2_5',
        question: 'Which JavaScript Array method is used to verify multiple elements in Playwright?',
        options: {
          a: 'elements.map(el => el.click())',
          b: 'elements.forEach(async el => await el.isVisible())',
          c: 'await Promise.all(elements.map(el => el.isVisible()))',
          d: 'elements.reduce((acc, el) => acc + el.textContent())'
        },
        correctAnswer: 'c',
        explanation: 'Promise.all() with map() allows checking multiple elements concurrently and waiting for all results.'
      }
    ],
    module3: [
      {
        id: 'q3_1',
        question: 'What is the correct JavaScript syntax to launch a Playwright browser?',
        options: {
          a: 'const browser = playwright.chromium.launch();',
          b: 'const browser = new playwright.Browser();',
          c: 'const browser = await playwright.chromium.launch();',
          d: 'const browser = playwright.launch("chromium");'
        },
        correctAnswer: 'c',
        explanation: 'Browser launch is async, so it requires await: const browser = await playwright.chromium.launch();'
      },
      {
        id: 'q3_2',
        question: 'Which JavaScript code correctly navigates to a URL and waits for load?',
        options: {
          a: 'page.goto("https://example.com");',
          b: 'await page.goto("https://example.com");',
          c: 'page.navigate("https://example.com");',
          d: 'await page.open("https://example.com");'
        },
        correctAnswer: 'b',
        explanation: 'page.goto() returns a Promise and should be awaited: await page.goto("url");'
      },
      {
        id: 'q3_3',
        question: 'What is the correct way to click an element and wait in JavaScript?',
        options: {
          a: 'page.click("button"); await page.waitForTimeout(1000);',
          b: 'await page.click("button");',
          c: 'page.click("button").wait();',
          d: 'click(page, "button");'
        },
        correctAnswer: 'b',
        explanation: 'page.click() handles waiting automatically when awaited: await page.click("selector");'
      },
      {
        id: 'q3_4',
        question: 'How do you fill a form field with JavaScript template literals in Playwright?',
        options: {
          a: 'await page.fill("#email", "user@" + domain + ".com");',
          b: 'await page.fill("#email", `user@${domain}.com`);',
          c: 'await page.fill("#email", "user@{domain}.com");',
          d: 'await page.fill("#email", concat("user@", domain, ".com"));'
        },
        correctAnswer: 'b',
        explanation: 'Template literals with ${} provide clean string interpolation: `user@${domain}.com`'
      },
      {
        id: 'q3_5',
        question: 'Which JavaScript code waits for an element and gets its text?',
        options: {
          a: 'const text = page.textContent("h1"); await page.waitForSelector("h1");',
          b: 'const text = await page.textContent("h1", { wait: true });',
          c: 'await page.waitForSelector("h1"); const text = await page.textContent("h1");',
          d: 'const text = await page.getElementText("h1");'
        },
        correctAnswer: 'c',
        explanation: 'First wait for element, then get text: await page.waitForSelector("h1"); const text = await page.textContent("h1");'
      }
    ],
    module4: [
      {
        id: 'q4_1',
        question: 'What is the correct JavaScript class structure for a Playwright Page Object?',
        options: {
          a: 'function LoginPage() { this.page = page; }',
          b: 'const LoginPage = { login: () => {} }',
          c: 'class LoginPage { constructor(page) { this.page = page; } }',
          d: 'export default function(page) { return { login: () => {} }; }'
        },
        correctAnswer: 'c',
        explanation: 'ES6 classes provide the best structure: class PageName { constructor(page) { this.page = page; } }'
      },
      {
        id: 'q4_2',
        question: 'How should you define selectors in a JavaScript Page Object class?',
        options: {
          a: 'In the constructor as this.selectors = { ... }',
          b: 'As private class fields: #emailInput = "#email"',
          c: 'As static class properties or getter methods',
          d: 'In separate JSON files'
        },
        correctAnswer: 'c',
        explanation: 'Static properties or getters keep selectors organized: static get emailInput() { return "#email"; }'
      },
      {
        id: 'q4_3',
        question: 'What is the correct JavaScript syntax for a Page Object method?',
        options: {
          a: 'login = (email, password) => { this.page.fill("#email", email); }',
          b: 'async login(email, password) { await this.page.fill("#email", email); }',
          c: 'function login(email, password) { this.page.fill("#email", email); }',
          d: 'login: async function(email, password) { this.page.fill("#email", email); }'
        },
        correctAnswer: 'b',
        explanation: 'Use async methods with await: async methodName() { await this.page.action(); }'
      },
      {
        id: 'q4_4',
        question: 'How do you properly instantiate a Page Object in JavaScript?',
        options: {
          a: 'const loginPage = LoginPage(page);',
          b: 'const loginPage = new LoginPage().init(page);',
          c: 'const loginPage = create(LoginPage, page);',
          d: 'const loginPage = new LoginPage(page);'
        },
        correctAnswer: 'd',
        explanation: 'Use the new keyword with constructor parameter: const pageObject = new PageClass(page);'
      },
      {
        id: 'q4_5',
        question: 'What JavaScript feature allows method chaining in Page Objects?',
        options: {
          a: 'Arrow functions',
          b: 'Returning this from methods',
          c: 'Using async/await',
          d: 'Template literals'
        },
        correctAnswer: 'b',
        explanation: 'Return this from methods to enable chaining: async fillForm() { /* actions */; return this; }'
      }
    ],
    module5: [
      {
        id: 'q5_1',
        question: 'What is the correct JavaScript syntax for making a GET request in Playwright?',
        options: {
          a: 'const response = playwright.request.get("/api/users");',
          b: 'const response = await request.get("/api/users");',
          c: 'const response = await page.request.get("/api/users");',
          d: 'const response = await api.get("/api/users");'
        },
        correctAnswer: 'c',
        explanation: 'Use page.request or request fixture: const response = await page.request.get("/api/users");'
      },
      {
        id: 'q5_2',
        question: 'How do you send JSON data in a POST request using JavaScript?',
        options: {
          a: 'await request.post("/api", "{\\"name\\": \\"John\\"}");',
          b: 'await request.post("/api", { data: JSON.stringify({name: "John"}) });',
          c: 'await request.post("/api", { data: {name: "John"} });',
          d: 'await request.post("/api", {name: "John"});'
        },
        correctAnswer: 'c',
        explanation: 'Use the data option with object: await request.post("/api", { data: {name: "John"} });'
      },
      {
        id: 'q5_3',
        question: 'What JavaScript method extracts JSON response data?',
        options: {
          a: 'const data = response.json();',
          b: 'const data = await response.json();',
          c: 'const data = JSON.parse(response.body);',
          d: 'const data = response.getData();'
        },
        correctAnswer: 'b',
        explanation: 'Response.json() is async: const data = await response.json();'
      },
      {
        id: 'q5_4',
        question: 'How do you validate API response status using JavaScript expect?',
        options: {
          a: 'assert(response.status === 200);',
          b: 'response.status.should.equal(200);',
          c: 'expect(response.status()).toBe(200);',
          d: 'if(response.status !== 200) throw new Error();'
        },
        correctAnswer: 'c',
        explanation: 'Use Playwright expect: expect(response.status()).toBe(200);'
      },
      {
        id: 'q5_5',
        question: 'What JavaScript code validates API response contains specific data?',
        options: {
          a: 'expect(await response.json()).toHaveProperty("name");',
          b: 'assert(response.json().name !== undefined);',
          c: 'response.json().name.should.exist;',
          d: 'if (!response.json().name) fail();'
        },
        correctAnswer: 'a',
        explanation: 'Use expect with await: expect(await response.json()).toHaveProperty("name");'
      }
    ],
    module6: [
      {
        id: 'q6_1',
        question: 'How do you define a custom fixture in JavaScript for Playwright?',
        options: {
          a: 'const fixture = { page: browser.newPage() };',
          b: 'test.use({ customFixture: "value" });',
          c: 'const test = base.extend({ myFixture: async ({}, use) => { await use(value); } });',
          d: 'test.fixture("name", () => value);'
        },
        correctAnswer: 'c',
        explanation: 'Extend base test with async fixture: const test = base.extend({ myFixture: async ({}, use) => { await use(value); } });'
      },
      {
        id: 'q6_2',
        question: 'What JavaScript code handles file upload in Playwright?',
        options: {
          a: 'await page.upload("#file", "./test.pdf");',
          b: 'await page.setInputFiles("#file", "./test.pdf");',
          c: 'await page.addFile("#file", "./test.pdf");',
          d: 'await page.fileUpload("#file", "./test.pdf");'
        },
        correctAnswer: 'b',
        explanation: 'Use setInputFiles method: await page.setInputFiles("#file", "./test.pdf");'
      },
      {
        id: 'q6_3',
        question: 'How do you create isolated browser contexts in JavaScript?',
        options: {
          a: 'const context = browser.newContext({ incognito: true });',
          b: 'const context = await browser.newContext();',
          c: 'const context = browser.createContext();',
          d: 'const context = new BrowserContext(browser);'
        },
        correctAnswer: 'b',
        explanation: 'Create context with await: const context = await browser.newContext();'
      },
      {
        id: 'q6_4',
        question: 'What JavaScript code manages multiple pages/tabs?',
        options: {
          a: 'const pages = await browser.getAllPages();',
          b: 'const newTab = window.open();',
          c: 'const [newPage] = await Promise.all([context.waitForEvent("page"), page.click("a[target=_blank]")]);',
          d: 'const newPage = page.openTab();'
        },
        correctAnswer: 'c',
        explanation: 'Handle new page events: const [newPage] = await Promise.all([context.waitForEvent("page"), triggerAction]);'
      },
      {
        id: 'q6_5',
        question: 'How do you start tracing in JavaScript for debugging?',
        options: {
          a: 'await page.startTrace({ screenshots: true });',
          b: 'await context.tracing.start({ screenshots: true, snapshots: true });',
          c: 'await browser.trace.begin();',
          d: 'await playwright.trace.start();'
        },
        correctAnswer: 'b',
        explanation: 'Start tracing on context: await context.tracing.start({ screenshots: true, snapshots: true });'
      }
    ],
    module7: [
      {
        id: 'q7_1',
        question: 'How do you run Playwright tests on multiple browsers simultaneously?',
        options: {
          a: 'It\'s not possible',
          b: 'Using projects configuration in playwright.config.js',
          c: 'Using separate test files only',
          d: 'Using external tools only'
        },
        correctAnswer: 'b',
        explanation: 'Playwright uses projects configuration in playwright.config.js to run tests across multiple browsers simultaneously.'
      },
      {
        id: 'q7_2',
        question: 'What is the recommended way to run Playwright tests in CI/CD pipelines?',
        options: {
          a: 'Manual execution only',
          b: 'Using external testing services only',
          c: 'Using Docker containers or GitHub Actions',
          d: 'CI/CD is not supported'
        },
        correctAnswer: 'c',
        explanation: 'Playwright integrates well with CI/CD using Docker containers, GitHub Actions, and other CI/CD platforms for automated testing.'
      },
      {
        id: 'q7_3',
        question: 'What does headless mode mean in Playwright?',
        options: {
          a: 'Running tests without a visible browser window',
          b: 'Running tests without network access',
          c: 'Running tests without JavaScript',
          d: 'Running tests without CSS'
        },
        correctAnswer: 'a',
        explanation: 'Headless mode runs browser tests without displaying the browser window, which is faster and suitable for CI/CD environments.'
      },
      {
        id: 'q7_4',
        question: 'How do you generate test reports in Playwright?',
        options: {
          a: 'Reports are not supported',
          b: 'Using external tools only',
          c: 'Using console.log() statements',
          d: 'Using built-in reporters like HTML, JSON, or JUnit'
        },
        correctAnswer: 'd',
        explanation: 'Playwright provides built-in reporters (HTML, JSON, JUnit, etc.) and supports custom reporters for generating test reports.'
      },
      {
        id: 'q7_5',
        question: 'What is the benefit of parallel test execution in Playwright?',
        options: {
          a: 'Tests become more accurate',
          b: 'Faster test execution and better resource utilization',
          c: 'Tests become easier to write',
          d: 'Tests require less maintenance'
        },
        correctAnswer: 'b',
        explanation: 'Parallel execution reduces overall test execution time and makes better use of available system resources.'
      }
    ],
    module8: [
      {
        id: 'q8_1',
        question: 'How do you enable debug mode in JavaScript Playwright tests?',
        options: {
          a: 'await page.debug();',
          b: 'DEBUG=pw:api npx playwright test',
          c: 'await page.pause();',
          d: 'console.debug("test");'
        },
        correctAnswer: 'c',
        explanation: 'Use page.pause() to pause execution and open Playwright Inspector: await page.pause();'
      },
      {
        id: 'q8_2',
        question: 'What JavaScript code measures page load performance?',
        options: {
          a: 'const timing = await page.evaluate(() => performance.timing);',
          b: 'const timing = page.getLoadTime();',
          c: 'const timing = await page.performance();',
          d: 'const timing = performance.now();'
        },
        correctAnswer: 'a',
        explanation: 'Use page.evaluate to access browser APIs: const timing = await page.evaluate(() => performance.timing);'
      },
      {
        id: 'q8_3',
        question: 'How do you set up request interception in JavaScript?',
        options: {
          a: 'page.intercept("**/*", request => request.continue());',
          b: 'await page.route("**/*", route => route.continue());',
          c: 'page.onRequest(request => request.continue());',
          d: 'await page.mock("**/*", response => response);'
        },
        correctAnswer: 'b',
        explanation: 'Use page.route for request interception: await page.route("**/*", route => route.continue());'
      },
      {
        id: 'q8_4',
        question: 'What JavaScript code captures console messages during test execution?',
        options: {
          a: 'const logs = page.consoleLogs();',
          b: 'page.on("console", msg => console.log(msg.text()));',
          c: 'const logs = await page.getConsole();',
          d: 'page.console.capture();'
        },
        correctAnswer: 'b',
        explanation: 'Listen to console events: page.on("console", msg => console.log(msg.text()));'
      },
      {
        id: 'q8_5',
        question: 'How do you generate traces with custom JavaScript data?',
        options: {
          a: 'await context.tracing.start(); /* test code */; await context.tracing.stop({ path: "trace.zip" });',
          b: 'await page.trace("trace.zip");',
          c: 'await browser.saveTrace("trace.zip");',
          d: 'trace.record(() => { /* test code */ });'
        },
        correctAnswer: 'a',
        explanation: 'Start tracing, run tests, then stop with path: await context.tracing.start(); /* test */; await context.tracing.stop({ path: "trace.zip" });'
      }
    ]
  };

  // Quiz functionality
  selectAnswer(questionId: string, answer: string): void {
    this.quizAnswers[questionId] = answer;
  }

  toggleQuizModule(moduleId: string): void {
    this.expandedQuizModules[moduleId] = !this.expandedQuizModules[moduleId];
  }

  isCorrectAnswer(questionId: string, option: string): boolean {
    return this.correctAnswers[questionId] === option;
  }

  showAllResults(): void {
    this.showResults = true;
  }

  getTotalQuestions(): number {
    return Object.keys(this.correctAnswers).length;
  }

  getAnsweredCount(): number {
    return Object.keys(this.quizAnswers).length;
  }

  getCorrectCount(): number {
    return Object.keys(this.quizAnswers).filter(
      questionId => this.quizAnswers[questionId] === this.correctAnswers[questionId]
    ).length;
  }

  getModuleQuestionCount(moduleId: string): number {
    return this.questions[moduleId as keyof typeof this.questions]?.length || 0;
  }

  getModuleAnsweredCount(moduleId: string): number {
    const moduleQuestions = this.questions[moduleId as keyof typeof this.questions];
    return moduleQuestions.filter(q => this.quizAnswers[q.id]).length;
  }

  getModuleCorrectCount(moduleId: string): number {
    const moduleQuestions = this.questions[moduleId as keyof typeof this.questions];
    return moduleQuestions.filter(q => 
      this.quizAnswers[q.id] && this.quizAnswers[q.id] === this.correctAnswers[q.id]
    ).length;
  }

  getModuleScorePercentage(moduleId: string): number {
    const moduleQuestions = this.questions[moduleId as keyof typeof this.questions];
    const answered = moduleQuestions.filter(q => this.quizAnswers[q.id]);
    const correct = answered.filter(q => this.quizAnswers[q.id] === this.correctAnswers[q.id]);
    
    if (answered.length === 0) return 0;
    return Math.round((correct.length / answered.length) * 100);
  }

  // Template helper methods
  trackByQuestionId(index: number, question: QuizQuestion): string {
    return question.id;
  }

  getModuleQuestions(moduleId: string): QuizQuestion[] {
    return this.questions[moduleId as keyof typeof this.questions] || [];
  }

  getOptionText(question: QuizQuestion, option: string): string {
    return question.options[option as keyof typeof question.options] || '';
  }

  getOverallProgress(): number {
    const totalQuestions = this.getTotalQuestions();
    const answeredQuestions = Object.keys(this.quizAnswers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  submitQuiz(): void {
    this.showResults = true;
  }

  resetQuiz(): void {
    this.quizAnswers = {};
    this.showResults = false;
    this.expandedQuizModules = {
      'module1': true,
      'module2': false,
      'module3': false,
      'module4': false,
      'module5': false,
      'module6': false,
      'module7': false,
      'module8': false
    };
  }

  getOverallScore(): number {
    const totalAnswered = Object.keys(this.quizAnswers).length;
    const correctAnswers = Object.keys(this.quizAnswers).filter(
      questionId => this.quizAnswers[questionId] === this.correctAnswers[questionId]
    ).length;
    
    if (totalAnswered === 0) return 0;
    return Math.round((correctAnswers / totalAnswered) * 100);
  }

  getScoreStatus(): string {
    const score = this.getOverallScore();
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'needs-improvement';
  }

  getScoreMessage(): string {
    const score = this.getOverallScore();
    if (score >= 90) return 'Outstanding! 🌟';
    if (score >= 80) return 'Great job! 👍';
    if (score >= 70) return 'Good work! 👌';
    return 'Keep learning! 📚';
  }

  getCompletionTime(): string {
    // For now, return a placeholder. You could implement actual timing logic
    return 'N/A';
  }

  get modules() {
    return [
      { id: 'module1', title: '🔰 Module 1: Playwright Foundations' },
      { id: 'module2', title: '📜 Module 2: JavaScript for Playwright' },
      { id: 'module3', title: '⚡ Module 3: Playwright Essentials' },
      { id: 'module4', title: '🏗️ Module 4: Page Object Model & Best Practices' },
      { id: 'module5', title: '🌐 Module 5: API Testing with Playwright' },
      { id: 'module6', title: '🚀 Module 6: Advanced Features' },
      { id: 'module7', title: '🔄 Module 7: Cross-browser Testing & CI/CD' },
      { id: 'module8', title: '🔧 Module 8: Performance & Debugging' }
    ];
  }
}