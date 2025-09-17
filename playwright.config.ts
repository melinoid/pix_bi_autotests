import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60000,
  snapshotPathTemplate: '{testDir}/screenshots/{testFilePath}/{arg}{ext}',

  use: {
    ...devices['Desktop Chrome'],
    locale: 'ru-RU',
    timezoneId: 'Asia/Yekaterinburg',
    video: 'on-first-retry',
    viewport: { width: 1800, height: 1042 },
    launchOptions: { slowMo: 0 },
    baseURL: process.env.BI_URL,
    ignoreHTTPSErrors: true,
  },

  projects: [
    // Глобальная UI авторизация
    { name: 'Setup UI Data 31', testMatch: '**/ui/setup/setup.*.ts', teardown: 'Remove UI Data 31' },
    // UI тесты
    {
      name: 'Smoke 1.31',
      testMatch: '**/ui/@(spec|test).*.?(c|m)[jt]s?(x)',
      dependencies: ['Setup UI Data 31'],
      use: {
        // storageState: '.temp/mainSession.json',
      },
    },
    // Удаление данных после UI тестов
    {
      name: 'Remove UI Data 31',
      testMatch: '**/ui/setup/teardown.deleteTestData.ts',
    },
    // Глобальная API авторизация
    {
      name: 'Setup API Data 31',
      testMatch: '**/api/setup/setup.getToken.ts',
      teardown: 'Remove API Data 31',
    },
    // API скрипты
    {
      name: 'API Scripts 31',
      timeout: 200000000,
      testMatch: '**/api/@(suite|test).*.?(c|m)[jt]s?(x)',
      dependencies: ['Setup API Data 31'],
      use: {
        extraHTTPHeaders: {
          authorization: process.env.BI_TOKEN || '',
          'content-type': 'application/json',
        },
      },
    },
    // Удаление данных после тестов
    {
      name: 'Remove API Data 31',
      testMatch: '**/api/setup/teardown.deleteTestData.ts',
    },
  ],
});
