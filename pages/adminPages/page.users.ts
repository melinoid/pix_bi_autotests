import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Администрирование` –> `Пользователи`. */
export default class UsersPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly createUserBtn: Locator;
  readonly table: Components.Table;

  readonly newUserPage: {
    readonly pageTitle: Locator;
    readonly usernameField: Components.InputField;
    readonly displayedNameField: Components.InputField;
    readonly emailField: Components.InputField;
    readonly passwordField: Components.InputField;
    readonly repeatPasswordField: Components.InputField;
    readonly groupsSelectorField: Components.SelectorField;
    readonly isActiveCheckbox: Components.CheckBox;
    readonly firstLoginResetPasswordCheckbox: Components.CheckBox;
    readonly actionAlert: Locator;
    readonly createBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-table-wrapper) h2');
    this.createUserBtn = page.locator(':above(.ant-table-container):right-of([aria-label=setting])button').first();
    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };

    this.newUserPage = {
      pageTitle: page.locator(':above(form[id=user_create])h2'),
      usernameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(0),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=text]').nth(0),
      },
      displayedNameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(1),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=text]').nth(1),
      },
      emailField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(2),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=text]').nth(2),
      },
      passwordField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(3),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input').nth(3),
      },
      repeatPasswordField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(4),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input').nth(4),
      },
      groupsSelectorField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(5),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row .ant-select-selector'),
        dropdown: page.locator(':right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner'),
      },
      isActiveCheckbox: {
        label: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(6)
          .locator('span:not([class])'),
        checkbox: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(6)
          .locator('.ant-checkbox'),
      },
      firstLoginResetPasswordCheckbox: {
        label: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(7)
          .locator('span:not([class])'),
        checkbox: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(7)
          .locator('.ant-checkbox'),
      },
      actionAlert: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(8).getByRole('alert'),
      createBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').last().getByRole('button'),
    };
  }
}
