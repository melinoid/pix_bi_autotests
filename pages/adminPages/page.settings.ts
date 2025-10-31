import { Locator, type Page } from '@playwright/test';

/** Локаторы и функции для раздела `Администрирование` –> `Настройки`. */
export default class SettingsPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-typography.heading) h2');
  }
}
