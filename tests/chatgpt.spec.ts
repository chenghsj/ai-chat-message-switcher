import { test } from './helpers/extension-helpers';
import {
  checkExtensionVisible,
  navigateToSite,
  sendMessageAndVerifyResponse,
} from './helpers/test-utils';

const CHATGPT_URL = 'https://chatgpt.com';

// ChatGPT Website Test Cases
test.describe('ChatGPT Website Tests', () => {
  test.beforeEach(async ({ extensionPage }) => {
    await navigateToSite(extensionPage, CHATGPT_URL);
  });

  test('Should display the extension', async ({ extensionPage }) => {
    await checkExtensionVisible(extensionPage);
  });

  test('Should open ChatGPT website and send a message', async ({
    extensionPage,
  }) => {
    // ChatGPT-specific selectors
    const PROMPT_TEXTAREA_SELECTOR = '#prompt-textarea';
    const COMPOSER_SUBMIT_BUTTON_SELECTOR = '#composer-submit-button';
    const USER_MESSAGE_SELECTOR = '[data-message-author-role="user"]';
    const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';
    const SCROLL_CONTAINER_SELECTOR = '.\\[scrollbar-gutter\\:stable\\]';

    await sendMessageAndVerifyResponse(
      extensionPage,
      PROMPT_TEXTAREA_SELECTOR,
      USER_MESSAGE_SELECTOR,
      ASSISTANT_MESSAGE_SELECTOR,
      SCROLL_CONTAINER_SELECTOR,
      'press',
      COMPOSER_SUBMIT_BUTTON_SELECTOR
    );
  });
});
