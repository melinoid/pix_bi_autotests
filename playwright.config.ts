import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  reportSlowTests: null,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: 'list',
  timeout: 180000,
  snapshotPathTemplate: '{testDir}/screenshots/{testFilePath}/{arg}{ext}',
  use: {
    locale: 'ru-RU',
    video: 'on-first-retry',
    launchOptions: { slowMo: 0 },
    baseURL: process.env.BI_URL,
    ignoreHTTPSErrors: true,
  },
  projects: [
    // Подготовка тестовых данных
    {
      name: 'Setup UI Data 32',
      testMatch: '**/ui/setup/setup.*.ts',
      teardown: 'Remove UI Data 32',
      use: { ...devices['Desktop Chrome'] },
    },

    // UI тесты для Chromium
    {
      name: 'Smoke 1.32 Chromium',
      testMatch: '**/ui/@(spec|test).*.?(c|m)[jt]s?(x)',
      dependencies: ['Setup UI Data 32'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1800, height: 1042 } },
    },
    // UI тесты для Firefox
    {
      name: 'Smoke 1.32 Firefox',
      testMatch: '**/ui/@(spec|test).*.?(c|m)[jt]s?(x)',
      dependencies: ['Setup UI Data 32'],
      use: { ...devices['Desktop Firefox'], viewport: { width: 1800, height: 1042 } },
    },
    // UI тесты для Edge
    {
      name: 'Smoke 1.32 Edge',
      testMatch: '**/ui/@(spec|test).*.?(c|m)[jt]s?(x)',
      dependencies: ['Setup UI Data 32'],
      use: { ...devices['Desktop Edge'], viewport: { width: 1800, height: 1042 } },
    },

    // Удаление данных после UI тестов
    {
      name: 'Remove UI Data 32',
      testMatch: '**/ui/setup/teardown.deleteTestData.ts',
      timeout: 6000,
      use: { ...devices['Desktop Chrome'] },
    },

    // Глобальная API авторизация
    {
      name: 'Setup API Data 32',
      testMatch: '**/api/setup/setup.getToken.ts',
    },

    // API скрипты
    {
      name: 'API Scripts 32',
      timeout: 200000000,
      testMatch: '**/api/@(suite|test).*.?(c|m)[jt]s?(x)',
      dependencies: ['Setup API Data 32'],
      use: {
        extraHTTPHeaders: {
          authorization: process.env.BI_TOKEN || '',
          'content-type': 'application/json',
        },
      },
    },
  ],
});
