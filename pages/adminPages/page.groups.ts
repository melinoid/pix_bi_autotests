import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Администрирование` –> `Группы`. */
export default class GroupsPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly createGroupBtn: Locator;

  readonly table: Components.Table;

  readonly newGroupPage: {
    readonly pageTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.InputField;
    readonly actionAlert: Locator;
    readonly createBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-table-container) h2');
    this.createGroupBtn = page.locator(':above(.ant-table-container):right-of([aria-label=setting])button');

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };

    this.newGroupPage = {
      pageTitle: page.locator(':above(form[id=user_create])h2'),
      nameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(0),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=text]').nth(0),
      },
      descriptionField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(1),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=text]').nth(1),
      },
      actionAlert: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .show-status').getByRole('alert'),
      createBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row button'),
    };
  }
}
