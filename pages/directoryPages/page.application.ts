import { Locator, type Page } from '@playwright/test';

/** Локаторы и функции для раздела `Директории` –> `Директория` -> `Приложение`. */
export default class ApplicationPage {
  readonly page: Page;

  readonly dirName: Locator;
  readonly appName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dirName = page
      .locator(':right-of(.ant-menu) :above(.ant-collapse-header)')
      .locator(' //div[contains(@class, "DirectoryPage_breadcrumbs")]')
      .locator('a');
    this.appName = page.locator(':right-of(.ant-menu) :above(.ant-collapse-header) h2');
  }
}
