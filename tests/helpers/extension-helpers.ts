import { BrowserContext, Page, test as base, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定義自訂 fixture 的型別
type MyFixtures = {
  extensionPage: Page;
};

export const test = base.extend<MyFixtures>({
  // 重新定義 context，載入你的 extension
  context: async ({}, use) => {
    const extensionPath = path.join(__dirname, '../../dist');

    const context = await chromium.launchPersistentContext('', {
      headless: false, // 擴展測試需要非無頭模式
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    await use(context);
    await context.close();
  },

  // 新增 extensionPage fixture，利用 context 創建新的頁面
  extensionPage: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});

export { expect } from '@playwright/test';
