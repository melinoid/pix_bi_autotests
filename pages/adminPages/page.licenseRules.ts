import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Администрирование` –> `Распределение лицензий`. */
export default class LicenseRulesPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly createRuleBtn: Locator;

  readonly table: Components.Table;

  readonly newRulePage: {
    readonly pageTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.TextareaField;
    readonly enabledCheckbox: Components.CheckBox;
    readonly newUserApplyCheckbox: Components.CheckBox;
    readonly licenseTypeField: Components.SelectorField;
    readonly userFilterLabel: Locator;
    readonly addUserFilterBtn: Locator;
    readonly actionAlert: Locator;
    readonly createBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-table-container) h2');
    this.createRuleBtn = page.locator(':above(.ant-table-container):right-of([aria-label=setting])button');

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };

    this.newRulePage = {
      pageTitle: page.locator(':above(form[id=rules_create])h2'),
      nameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(0),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=text]').nth(0),
      },
      descriptionField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(1),
        textarea: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row textarea'),
      },
      enabledCheckbox: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(2),
        checkbox: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=checkbox]').nth(0),
      },
      newUserApplyCheckbox: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(4),
        checkbox: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input[type=checkbox]').nth(1),
      },
      licenseTypeField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(6),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row span.ant-select-selection-item')
          .nth(0),
        dropdown: page.locator(':right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner'),
      },
      userFilterLabel: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(7),
      addUserFilterBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row button'),
      actionAlert: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .show-status').getByRole('alert'),
      createBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form button[type=submit]'),
    };
  }
}
