import { Locator, type Page } from '@playwright/test';

/** Локаторы и функции для раздела `Администрирование` –> `Рассылка`. */
export default class EmailReportsPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-table-container) h2');
  }
}
