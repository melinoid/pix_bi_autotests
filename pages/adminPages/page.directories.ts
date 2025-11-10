import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Администрирование` –> `Директории`. */
export default class DirectoriesPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly createDirBtn: Locator;

  readonly table: Components.Table;

  readonly createDirModal: {
    readonly modalTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.InputField;
    readonly createBtn: Locator;
  };

  readonly dirPage: {
    readonly pageTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.InputField;
    readonly actionAlert: Locator;
    readonly saveBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-table-container) h2');
    this.createDirBtn = page.locator(':above(.ant-table-container):right-of([aria-label=setting])button').first();

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };

    this.createDirModal = {
      modalTitle: page.locator('.ant-modal-content .ant-modal-header .ant-modal-title'),
      nameField: {
        label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(0),
        input: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(0),
      },
      descriptionField: {
        label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(1),
        input: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(1),
      },
      createBtn: page.locator('.ant-modal-content .ant-modal-footer .ant-btn-primary'),
    };

    this.dirPage = {
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
