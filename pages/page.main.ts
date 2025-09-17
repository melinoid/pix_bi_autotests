import { Locator, type Page } from '@playwright/test';

export default class MainPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':right-of(.ant-menu) h2');
  }
}
