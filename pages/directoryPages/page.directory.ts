import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Директории` –> `Директория`. */
export default class DirectoryPage {
  readonly page: Page;

  readonly pageDirName: Locator;
  readonly addAppBtn: Locator;

  readonly searchInput: Locator;

  readonly appModal: {
    readonly modalTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.InputField;
    readonly previewUpload: Locator;
    readonly createBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageDirName = page.locator(':right-of(.ant-menu) :above(input.ant-input-outlined) h2');
    this.addAppBtn = page.locator(':right-of(h2) button.ant-btn-primary');

    this.searchInput = page.getByTestId('directory-page-search-input');

    this.appModal = {
      modalTitle: page.locator('.ant-modal-content .ant-modal-header .ant-modal-title'),
      nameField: {
        label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(0),
        input: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(0),
      },
      descriptionField: {
        label: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item label').nth(1),
        input: page.locator('.ant-modal-content .ant-modal-body form .ant-form-item input').nth(1),
      },
      previewUpload: page.locator('.ant-modal-content .ant-modal-body div.ant-upload'),
      createBtn: page.locator('.ant-modal-content .ant-modal-footer .ant-btn-primary'),
    };
  }
}
