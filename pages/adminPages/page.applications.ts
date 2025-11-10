import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Администрирование` –> `Приложения`. */
export default class ApplicationsPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  readonly table: Components.Table;

  readonly appPage: {
    readonly pageTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.InputField;
    readonly actionAlert: Locator;
    readonly saveBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.control-line) h2');

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };

    this.appPage = {
      pageTitle: page.locator(':right-of(.ant-menu) h2'),
      nameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(0),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(0),
      },
      descriptionField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(1),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(1),
      },
      actionAlert: page.locator(':right-of(.ant-layout-sider-light):below(h2)form').getByRole('alert'),
      saveBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form button[type=submit]'),
    };
  }
}
