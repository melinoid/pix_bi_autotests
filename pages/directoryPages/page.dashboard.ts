import { Locator, type Page } from '@playwright/test';

/** Локаторы и функции для раздела `Директории` –> `Директория` -> `Приложение` -> `Дашборд`. */
export default class DashboardPage {
  readonly page: Page;

  readonly dashboardName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardName = page.locator('//div[contains(@class, "DashboardNavigation_dashboardName")]');
  }
}
