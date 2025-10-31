import { Locator, type Page } from '@playwright/test';

/** Локаторы и функции для раздела `Администрирование` –> `Приложения`. */
export default class ApplicationsPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.control-line) h2');
  }
}
