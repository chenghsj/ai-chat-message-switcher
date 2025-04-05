import { test } from './helpers/extension-helpers';
import {
  checkExtensionVisible,
  navigateToSite,
  sendMessageAndVerifyResponse,
} from './helpers/test-utils';

const GEMINI_URL = 'https://gemini.google.com';

// Gemini Website Test Cases
test.describe('Gemini Website Tests', () => {
  test.beforeEach(async ({ extensionPage }) => {
    await navigateToSite(extensionPage, GEMINI_URL);
  });

  test('Should display the extension', async ({ extensionPage }) => {
    await checkExtensionVisible(extensionPage);
  });

  // test('Should open Gemini website and send a message', async ({
  //   extensionPage,
  // }) => {
  //   // Gemini-specific selectors
  //   const PROMPT_TEXTAREA_SELECTOR = '.textarea.new-input-ui';
  //   const SEND_BUTTON_SELECTOR = '.send-button-container';
  //   const USER_MESSAGE_SELECTOR = '.query-content';
  //   const ASSISTANT_MESSAGE_SELECTOR = '.model-response-text';
  //   const SCROLL_CONTAINER_SELECTOR = '[data-test-id="chat-history-container"]';

  //   await sendMessageAndVerifyResponse(
  //     extensionPage,
  //     PROMPT_TEXTAREA_SELECTOR,
  //     USER_MESSAGE_SELECTOR,
  //     ASSISTANT_MESSAGE_SELECTOR,
  //     SCROLL_CONTAINER_SELECTOR,
  //     'click',
  //     SEND_BUTTON_SELECTOR
  //   );
  // });
});
