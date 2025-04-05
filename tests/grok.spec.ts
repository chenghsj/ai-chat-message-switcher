import { expect, test } from './helpers/extension-helpers';
import {
  checkExtensionVisible,
  logGreen,
  navigateToSite,
} from './helpers/test-utils';

const GROK_URL = 'https://grok.com';

// Grok Website Test Cases
test.describe('Grok Website Tests', () => {
  test.beforeEach(async ({ extensionPage }) => {
    await navigateToSite(extensionPage, GROK_URL);
  });

  test('Should display the extension', async ({ extensionPage }) => {
    await extensionPage.waitForTimeout(2000);
    const isVisible = await checkExtensionVisible(extensionPage);
    expect(isVisible).toBeTruthy();
    logGreen('Extension switcher is displayed on Grok');
  });

  // test('Should open Grok website and send a message', async ({
  //   extensionPage,
  // }) => {
  //   // Grok-specific selectors
  //   const PROMPT_TEXTAREA_SELECTOR = '[data-gtm-form-interact-field-id="0"]';
  //   const COMPOSER_SUBMIT_BUTTON_SELECTOR = '[type="submit"]';
  //   const USER_MESSAGE_SELECTOR = '.message-bubble';
  //   const ASSISTANT_MESSAGE_SELECTOR = '.message-bubble';
  //   const SCROLL_CONTAINER_SELECTOR = '.scrollbar-gutter-stable';

  //   await sendMessageAndVerifyResponse(
  //     extensionPage,
  //     PROMPT_TEXTAREA_SELECTOR,
  //     USER_MESSAGE_SELECTOR,
  //     ASSISTANT_MESSAGE_SELECTOR,
  //     SCROLL_CONTAINER_SELECTOR,
  //     'press',
  //     COMPOSER_SUBMIT_BUTTON_SELECTOR
  //   );
  // });
});
