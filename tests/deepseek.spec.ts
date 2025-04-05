import { test } from './helpers/extension-helpers';
import { checkExtensionVisible, navigateToSite } from './helpers/test-utils';

const DEEPSEEK_URL = 'https://chat.deepseek.com';

// Deepseek Website Test Cases
test.describe('Deepseek Website Tests', () => {
  test.beforeEach(async ({ extensionPage }) => {
    await navigateToSite(extensionPage, DEEPSEEK_URL);
  });

  test('Should display the extension', async ({ extensionPage }) => {
    await checkExtensionVisible(extensionPage);
  });

  // test('Should open Deepseek website and send a message', async ({
  //   extensionPage,
  // }) => {
  //   // Deepseek-specific selectors
  //   const PROMPT_TEXTAREA_SELECTOR = '#chat-input';
  //   const COMPOSER_SUBMIT_BUTTON_SELECTOR = '._7436101';
  //   const USER_MESSAGE_SELECTOR = '.fbb737a4';
  //   const ASSISTANT_MESSAGE_SELECTOR = '.f9bf7997';
  //   const SCROLL_CONTAINER_SELECTOR = '._8f60047';

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
