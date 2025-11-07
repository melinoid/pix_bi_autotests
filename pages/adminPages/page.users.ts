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
    readonly passField: Components.InputField;
    readonly repeatPassField: Components.InputField;
    readonly groupsSelectorField: Components.SelectorField;
    readonly isActiveCheckbox: Components.CheckBox;
    readonly firstLoginResetPassCheckbox: Components.CheckBox;
    readonly actionAlert: Locator;
    readonly createBtn: Locator;
  };

  readonly editUserPage: {
    readonly pageTitle: Locator;
    readonly usernameField: Components.InputField;
    readonly displayedNameField: Components.InputField;
    readonly emailField: Components.InputField;
    readonly groupsSelectorField: Components.SelectorField;
    readonly isActiveCheckbox: Components.CheckBox;
    readonly isADCheckbox: Components.CheckBox;
    readonly adGroupField: Components.InputField;
    readonly adUserIDField: Components.InputField;
    readonly creationDateField: Components.InputField;
    readonly modificationDateField: Components.InputField;
    readonly updatedByField: Components.InputField;
    readonly licenseTypeField: Components.InputField;

    readonly changePassBtn: Locator;
    readonly changePassModal: {
      readonly modalTitle: Locator;
      readonly newPassField: Components.InputField;
      readonly repeatPassField: Components.InputField;
      readonly firstLoginResetPassCheckbox: Components.CheckBox;
      readonly changeBtn: Locator;
    };
    readonly actionAlert: Locator;
    readonly saveBtn: Locator;
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
      passField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row label').nth(3),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row input').nth(3),
      },
      repeatPassField: {
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
      firstLoginResetPassCheckbox: {
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

    this.editUserPage = {
      pageTitle: page.locator(':above(form[id=user_create])h2'),
      usernameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(0),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(0),
      },
      displayedNameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(1),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(1),
      },
      emailField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(2),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(2),
      },
      groupsSelectorField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(3),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(3),
        dropdown: page.locator(''),
      },
      isActiveCheckbox: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(4),
        checkbox: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(4),
      },
      isADCheckbox: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(5),
        checkbox: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(5),
      },
      adGroupField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(6),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(6),
      },
      adUserIDField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(7),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(7),
      },
      creationDateField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(8),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(8),
      },
      modificationDateField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(9),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(9),
      },
      updatedByField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(10),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(10),
      },
      licenseTypeField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item label').nth(11),
        input: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-form-item input').nth(11),
      },

      changePassBtn: page.locator(':right-of(.ant-layout-sider-light):below(form) button'),
      changePassModal: {
        modalTitle: page.locator('.ant-modal-content .ant-modal-header .ant-modal-title'),
        newPassField: {
          label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(0),
          input: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(0),
        },
        repeatPassField: {
          label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(1),
          input: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(1),
        },
        firstLoginResetPassCheckbox: {
          label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(2),
          checkbox: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(2),
        },
        changeBtn: page.locator('.ant-modal-content .ant-modal-footer .ant-btn-primary'),
      },
      actionAlert: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(13).getByRole('alert'),
      saveBtn: page
        .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
        .last()
        .locator('button[type=submit]'),
    };
  }
}
