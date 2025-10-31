import { Locator, type Page, expect } from '@playwright/test';
import { Components } from './components';

/** Общие локаторы и функции. */
export default class CommonPage {
  readonly page: Page;

  readonly sideMenu: {
    readonly logo: Locator;
    readonly homeBtn: Locator;
    readonly dirsBtn: Locator;
    readonly setsBtn: Locator;
    readonly adminBtn: Locator;
    readonly notificationBtn: Locator;
    readonly languageBtn: Locator;
    readonly logoutBtn: Locator;
    readonly logoutConfirmBtn: Locator;
  };

  readonly adminLinksMenu: {
    readonly usersLink: Locator;
    readonly groupsLink: Locator;
    readonly usersImportLink: Locator;
    readonly licenseRulesLink: Locator;
    readonly licenseProLink: Locator;
    readonly licenseBaseLink: Locator;

    readonly securityRules: Locator;
    readonly modifiersAuditLink: Locator;
    readonly rlsOmitLink: Locator;
    readonly adminSecurityRulesLink: Locator;
    readonly logsLink: Locator;

    readonly directoriesLink: Locator;
    readonly applicationsLink: Locator;
    readonly themesLink: Locator;
    readonly sharedLink: Locator;
    readonly geoserversLink: Locator;
    readonly emailReportsLink: Locator;

    readonly settingsLink: Locator;
    readonly licensesLink: Locator;
    readonly usefulLink: Locator;
    readonly specialApiLink: Locator;
  };

  readonly searchField: Components.SearchField;

  readonly deleteModal: Components.DeleteModal;

  readonly mainLoader: Locator;
  readonly contentLoader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sideMenu = {
      logo: page.locator('.ant-layout-sider').getByRole('img', { name: 'PixLogo' }),

      homeBtn: page.getByTestId('main-menu-home-button').getByTestId('left-menu-home-link'),
      dirsBtn: page.getByRole('link', { name: 'Директории' }),
      setsBtn: page.getByTestId('private-items-menu-data'),
      adminBtn: page.getByTestId('private-items-menu-administration'),
      notificationBtn: page.getByTestId('notifications-panel').locator('div').first(),
      languageBtn: page.getByTestId('translation-panel').locator('div').first(),
      logoutBtn: page.getByTestId('main-menu-logout-button').getByRole('menuitem').locator('div'),
      logoutConfirmBtn: page.getByRole('link', { name: 'Да', exact: true }),
    };

    this.adminLinksMenu = {
      usersLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/users"]'),
      groupsLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/groups"]'),
      usersImportLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/user-connector"]'),
      licenseRulesLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/license-rules"]'),
      licenseProLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/licenses-pro"]'),
      licenseBaseLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/licenses-base"]'),

      securityRules: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/security-rules"]'),
      modifiersAuditLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/modifiers-audit"]'),
      rlsOmitLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/rls-omit"]'),
      adminSecurityRulesLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/access-rules"]'),
      logsLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/logs"]'),

      directoriesLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/directories"]'),
      applicationsLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/applications"]'),
      themesLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/themes"]'),
      sharedLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/shared"]'),
      geoserversLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/geoservers"]'),
      emailReportsLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/email-reports"]'),

      settingsLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/settings"]'),
      licensesLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/licenses"]'),
      usefulLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/useful-links"]'),
      specialApiLink: page.locator('.ant-menu').nth(1).locator('.ant-menu-item a[href="/admin/special-api"]'),
    };

    this.searchField = {
      openBtn: page.locator('//button[contains(@class, "SearchUpdateButtons_search")]'),
      input: page.locator('//div[contains(@class, "SearchUpdateButtons")]').locator('input'),
      closeBtn: page.locator('//div[contains(@class, "SearchUpdateButtons")]').locator('button'),
    };

    this.deleteModal = {
      title: page.locator('.ant-modal-content .ant-modal-header .ant-modal-title'),
      closeBtn: page.locator('.ant-modal-content button.ant-modal-close'),
      text: page.locator('.ant-modal-content .ant-modal-body h5'),
      cancelBtn: page.locator('.ant-modal-content .ant-modal-footer button.ant-btn-default'),
      applyBtn: page.locator('.ant-modal-content .ant-modal-footer button.ant-btn-primary'),
    };

    this.mainLoader = page.locator("//div[contains(@class, 'Loader_loadingIndicator')]");
    this.contentLoader = page.locator('.ant-spin-spinning');
  }

  /**
   * Заполнение фильтра пользователей.
   * @param filter фильтр в формате [[строка фильтра], [and/or], [строка фильтра]...] .
   */
  async fillUserFilter(filter: string[][]) {
    if (filter.length == 0) throw Error('Фильтр пользователей отсутствует');
    this.page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row button').click();
    for (let i in filter) {
      const row = +i;
      if (filter[row].length > 1) {
        // Выбор сущности
        await this.page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form div[class*=Filter][class*=wrapper] .ant-row')
          .nth(row)
          .locator('input')
          .nth(0)
          .click();
        await this.page
          .locator(
            `:right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner :text-is("${userFilterMapping.type[filter[row][0] as keyof typeof userFilterMapping.type]}")`
          )
          .click();
        // Выбор сравнения
        await this.page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form div[class*=Filter][class*=wrapper] .ant-row')
          .nth(row)
          .locator('input')
          .nth(1)
          .click();
        await this.page
          .locator(
            `:right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner :text-is("${userFilterMapping.filter[filter[row][1] as keyof typeof userFilterMapping.filter]}")`
          )
          .click();
        // Заполнение фильтра
        if (filter[row][2]) {
          if (!['in', 'notin', 'isnull', 'notnull'].includes(filter[row][1])) {
            await this.page
              .locator(':right-of(.ant-layout-sider-light):below(h2)form div[class*=Filter][class*=wrapper] .ant-row')
              .nth(row)
              .locator('input')
              .nth(2)
              .fill(filter[row][2]);
          } else if (['in', 'notin'].includes(filter[row][1])) {
            await this.page
              .locator(':right-of(.ant-layout-sider-light):below(h2)form div[class*=Filter][class*=wrapper] .ant-row')
              .nth(row)
              .locator('input')
              .nth(2)
              .click();
            await this.page
              .locator(':right-of(.ant-layout-sider-light):below(h2)form div[class*=Filter][class*=wrapper] .ant-row')
              .nth(row)
              .locator('input')
              .nth(2)
              .fill(filter[row][2]);
            await this.page
              .locator(
                `:right-of(.ant-layout-sider-light):below(h2) .rc-virtual-list-holder-inner :text-is("${filter[row][2]}")`
              )
              .click();
          }
        }
      } else {
        // Выбор соединения фильтров
        this.page.locator(':right-of(.ant-layout-sider-light):below(h2)form .ant-row button').click();
        await this.page
          .locator(':right-of(.ant-layout-sider-light):below(h2)form div[class*=Filter][class*=wrapper] .ant-row')
          .nth(row)
          .locator(`:text-is("${userFilterMapping.join[filter[row][0] as keyof typeof userFilterMapping.join]}")`)
          .click();
      }
    }
  }
}

export const userFilterMapping = {
  type: {
    Id: 'Идентификатор',
    UserName: 'Имя пользователя',
    Email: 'E-mail',
    ModifiedBy: 'Кем изменён',
    LicenseType: 'Тип лицензии',
    UserGroupId: 'Группы пользователя',
    UserGroupName: 'Название группы пользователя',
  },
  filter: {
    like: 'Содержит',
    notlike: 'Не содержит',
    starts: 'Начинается с',
    notstarts: 'Не начинается с',
    ends: 'Заканчивается на',
    notends: 'Не заканчивается на',
    in: 'Является',
    notin: 'Не является',
    isnull: 'Является пустым',
    notnull: 'Не является пустым',
  },
  join: {
    and: 'И',
    or: 'ИЛИ',
  },
};
