import test, { Page, expect } from '@playwright/test';

// Common constants
export const TIMEOUT = 60000;
export const WAIT_TIMEOUT = 15000;

// Helper functions for colored logging
export const logGreen = (msg: string, ...args: any[]) => {
  console.log('\x1b[32m%s\x1b[0m', msg, ...args);
};

export const logYellow = (msg: string, ...args: any[]) => {
  console.log('\x1b[33m%s\x1b[0m', msg, ...args);
};

// Common selectors
export const MESSAGE_SWITCHER_SELECTOR = '#context-menu-open-trigger';

// Common test helpers
export async function navigateToSite(page: Page, url: string): Promise<void> {
  try {
    await page.goto(url, {
      timeout: TIMEOUT,
      waitUntil: 'domcontentloaded',
    });
    logGreen(`Successfully navigated to ${url}`);
  } catch (error) {
    console.error('Navigation error:', error);
    logYellow(`Current URL: ${page.url()}`);
  }
}

export async function checkExtensionVisible(page: Page): Promise<void> {
  // const hasCaptcha = await isRecaptchaPresent(page);
  // if (hasCaptcha) {
  //   test.skip(true, 'Test skipped due to CAPTCHA/login detection');
  //   return;
  // }
  const messageSwitcher = await page.waitForSelector(
    MESSAGE_SWITCHER_SELECTOR,
    { timeout: WAIT_TIMEOUT }
  );
  expect(messageSwitcher).toBeTruthy();
  logGreen('Extension switcher is displayed on ChatGPT');
}

export async function sendMessageAndVerifyResponse(
  page: Page,
  inputSelector: string,
  userMessageSelector: string,
  assistantMessageSelector: string,
  scrollContainerSelector: string,
  sendMethod: 'click' | 'press' = 'click',
  sendSelector: string = ''
): Promise<void> {
  // const hasCaptcha = await isRecaptchaPresent(page);
  // if (hasCaptcha) {
  //   test.skip(true, 'Test skipped due to CAPTCHA/login detection');
  //   return;
  // }
  // Wait for the chat input box to appear
  await page.waitForSelector(inputSelector, {
    timeout: WAIT_TIMEOUT,
  });
  logGreen('Chat input box is displayed');

  const inputText = 'Hello, how are you?';

  // Fill in the chat input
  await page.fill(inputSelector, inputText);
  logGreen(`Message entered: ${inputText}`);

  // Send the message
  if (sendMethod === 'click' && sendSelector) {
    await page.click(sendSelector);
    logGreen('Clicked send button');
  } else if (sendMethod === 'press' && sendSelector) {
    await page.press(sendSelector, 'Enter');
    logGreen('Pressed Enter to send the message');
  }

  // Verify user message appears
  const userMessage = await page.waitForSelector(userMessageSelector, {
    timeout: WAIT_TIMEOUT,
  });
  if (userMessage) {
    expect(userMessage).toBeTruthy();
    logGreen('User message is displayed');
  }

  // Verify assistant response appears
  const assistantMessage = await page.waitForSelector(
    assistantMessageSelector,
    { timeout: WAIT_TIMEOUT }
  );
  if (assistantMessage) {
    expect(assistantMessage).toBeTruthy();
    logGreen('Assistant response is displayed');
  }

  // Verify scroll container exists
  const scrollContainer = await page.waitForSelector(scrollContainerSelector, {
    timeout: WAIT_TIMEOUT,
  });
  if (scrollContainer) {
    expect(scrollContainer).toBeTruthy();
    logGreen('Scroll container is displayed');
  }
}

// ...existing code...

/**
 * Checks if reCAPTCHA is present on the page
 */
export async function isRecaptchaPresent(page: Page): Promise<boolean> {
  // Common reCAPTCHA selectors
  const recaptchaSelectors = [
    'iframe[src*="recaptcha"]',
    'iframe[src*="captcha"]',
    'div.g-recaptcha',
    'div[data-sitekey]',
    // Specific to Google/Gemini
    'div#captcha-box',
    // Common login elements that may indicate auth/verification
    'button:has-text("Sign in")',
    'button:has-text("Continue with Google")',
    'button:has-text("Log in")',
  ];

  for (const selector of recaptchaSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      logYellow(`⚠️ Detected CAPTCHA or login requirement: ${selector}`);
      return true;
    }
  }

  return false;
}
