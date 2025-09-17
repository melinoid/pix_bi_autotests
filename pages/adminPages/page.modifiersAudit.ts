import { Locator, type Page } from '@playwright/test';

export default class ModifiersAuditPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-select) h2');
  }
}
