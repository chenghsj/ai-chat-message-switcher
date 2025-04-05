import { test } from './helpers/extension-helpers';
import { checkExtensionVisible, navigateToSite } from './helpers/test-utils';

const CLAUDE_URL = 'https://claude.ai';

// Claude Website Test Cases
test.describe('Claude Website Tests', () => {
  test.beforeEach(async ({ extensionPage }) => {
    await navigateToSite(extensionPage, CLAUDE_URL);
  });

  test('Should display the extension', async ({ extensionPage }) => {
    await checkExtensionVisible(extensionPage);
  });

  // test('Should open Claude website and send a message', async ({
  //   extensionPage,
  // }) => {
  //   // Claude-specific selectors
  //   const PROMPT_TEXTAREA_SELECTOR = '.ProseMirror.break-words';
  //   const SEND_BUTTON_SELECTOR = 'button[aria-label="Send message"]';
  //   const USER_MESSAGE_SELECTOR = '.font-user-message';
  //   const ASSISTANT_MESSAGE_SELECTOR = '.font-claude-message';
  //   const CHAT_CONTAINER_SELECTOR = '.overflow-y-scroll';

  //   await sendMessageAndVerifyResponse(
  //     extensionPage,
  //     PROMPT_TEXTAREA_SELECTOR,
  //     USER_MESSAGE_SELECTOR,
  //     ASSISTANT_MESSAGE_SELECTOR,
  //     CHAT_CONTAINER_SELECTOR,
  //     'click',
  //     SEND_BUTTON_SELECTOR
  //   );
  // });
});
