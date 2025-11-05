import { Locator, type Page } from '@playwright/test';
import { Components } from '../components';

/** Локаторы и функции для раздела `Администрирование` –> `Импорт пользователей`. */
export default class UsersImportPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly createImportBtn: Locator;

  readonly importTypeTabs: {
    readonly ldap: Locator;
    readonly openid: Locator;
  };

  readonly table: Components.Table;

  readonly ldapImportPage: {
    readonly pageTitle: Locator;
    readonly nameField: Components.InputField;
    readonly descriptionField: Components.InputField;
    readonly enabledToggle: Components.Toggle;
    readonly lazyToggle: Components.Toggle;
    readonly activeDirectoryToggle: Components.Toggle;
    readonly serverField: Components.InputField;
    readonly portField: Components.InputField;
    readonly connectionTypeField: Components.SelectorField;
    readonly adUserField: Components.InputField;
    readonly adPasswordField: Components.InputField;
    readonly domainField: Components.InputField;
    readonly sslToggle: Components.Toggle;
    readonly tlsToggle: Components.Toggle;
    readonly searchBaseField: Components.InputField;
    readonly adQueryField: Components.TextareaField;
    readonly adSyncGroupsField: Components.TextareaField;
    readonly ldapProtocolField: Components.SelectorField;
    readonly timeoutField: Components.InputField;
    readonly periodicUpdateToggle: Components.Toggle;
    readonly periodicUpdateForm: {
      readonly timeZoneField: Components.SelectorField;
      readonly cronField: Components.InputField;
      readonly clearBtn: Locator;
    };
    readonly expandMappingFormHeader: Locator;
    readonly mappingForm: {
      readonly displayNameField: Components.InputField;
      readonly emailField: Components.InputField;
      readonly accountNameField: Components.InputField;
      readonly objectSIDField: Components.InputField;
      readonly groupMembershipField: Components.InputField;
      readonly objectClassField: Components.InputField;
      readonly userObjectClassField: Components.InputField;
      readonly groupObjectClassField: Components.InputField;
    };

    readonly createBtn: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(':above(.ant-tabs) h2');
    this.createImportBtn = page.locator(':above(.ant-table-container):right-of([aria-label=setting])button');

    this.importTypeTabs = {
      ldap: page.locator('[data-node-key=Ldap]'),
      openid: page.locator('[data-node-key=OpenId]'),
    };

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };

    this.ldapImportPage = {
      pageTitle: page.locator(':above(form[id=connector-edit])h2'),
      nameField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(0).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(0)
          .locator('input[type=text]'),
      },
      descriptionField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(1).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(1)
          .locator('input[type=text]'),
      },
      enabledToggle: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(2).locator('label'),
        toggle: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(2)
          .locator('button[role=switch]'),
      },
      lazyToggle: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(3).locator('label'),
        toggle: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(3)
          .locator('button[role=switch]'),
      },
      activeDirectoryToggle: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(4).locator('label'),
        toggle: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(4)
          .locator('button[role=switch]'),
      },
      serverField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(5).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(5)
          .locator('input[type=text]'),
      },
      portField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(6).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(6)
          .locator('input[type=number]'),
      },
      connectionTypeField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(7).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(7)
          .locator('span.ant-select-selection-item'),
        dropdown: page.locator(':right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner'),
      },
      adUserField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(8).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(8)
          .locator('input[type=text]'),
      },
      adPasswordField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(9).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(9)
          .locator('input[type=password]'),
      },
      domainField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(10).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(10)
          .locator('input[type=text]'),
      },
      sslToggle: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(11).locator('label'),
        toggle: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(11)
          .locator('button[role=switch]'),
      },
      tlsToggle: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(12).locator('label'),
        toggle: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(12)
          .locator('button[role=switch]'),
      },
      searchBaseField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(13).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(13)
          .locator('input[type=text]'),
      },
      adQueryField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(14).locator('label'),
        textarea: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(14).locator('textarea'),
      },
      adSyncGroupsField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(15).locator('label'),
        textarea: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(15).locator('textarea'),
      },
      ldapProtocolField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(16).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(16)
          .locator('span.ant-select-selection-item'),
        dropdown: page.locator(':right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner'),
      },
      timeoutField: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(17).locator('label'),
        input: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(17)
          .locator('input[type=number]'),
      },
      periodicUpdateToggle: {
        label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(18).locator('label'),
        toggle: page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
          .nth(18)
          .locator('button[role=switch]'),
      },
      periodicUpdateForm: {
        timeZoneField: {
          label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(19).locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
            .nth(19)
            .locator('span.ant-select-selection-item'),
          dropdown: page.locator(':right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner'),
        },
        cronField: {
          label: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(20).locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row')
            .nth(20)
            .locator('input[type=text]'),
        },
        clearBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row').nth(21).locator('button'),
      },
      expandMappingFormHeader: page.locator(
        ':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-collapse-header'
      ),
      mappingForm: {
        displayNameField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(0)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(0)
            .locator('input[type=text]'),
        },
        emailField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(1)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(1)
            .locator('input[type=text]'),
        },
        accountNameField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(2)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(2)
            .locator('input[type=text]'),
        },
        objectSIDField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(3)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(3)
            .locator('input[type=text]'),
        },
        groupMembershipField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(4)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(4)
            .locator('input[type=text]'),
        },
        objectClassField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(5)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(5)
            .locator('input[type=text]'),
        },
        userObjectClassField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(6)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(6)
            .locator('input[type=text]'),
        },
        groupObjectClassField: {
          label: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(7)
            .locator('label'),
          input: page
            .locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-collapse .ant-row')
            .nth(7)
            .locator('input[type=text]'),
        },
      },
      createBtn: page.locator(':right-of(.ant-layout-sider-light):below(h2)form button[type=submit]'),
    };
  }
}
