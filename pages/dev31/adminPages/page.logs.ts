import { Locator, type Page } from '@playwright/test';
import { Components } from '../../components';

export default class LogsPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  readonly tabs: {
    readonly eventLogs: Locator;
    readonly informationSecurityLogs: Locator;
    readonly navigationLogs: Locator;
    readonly apiEventLogs: Locator;
  };

  readonly table: Components.Table;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.etl-main-tables-tabs) h2');

    this.tabs = {
      eventLogs: page.locator('[data-node-key=eventLogs]'),
      informationSecurityLogs: page.locator('[data-node-key=isLogs]'),
      navigationLogs: page.locator('[data-node-key=navigationLogs]'),
      apiEventLogs: page.locator('[data-node-key=apiLogs]'),
    };

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };
  }
}
