import { expect, Locator, type Page } from '@playwright/test';
import { Components } from '../components';
import dayjs, { Dayjs } from 'dayjs';
import Helper from '../../utils/helper';

export interface LogInfo {
  event: string;
  time: Dayjs;
  options: string[];
  address?: string;
  serverName?: string;
  importanceLevel: string;
  message: string;
  section: string;
  operObjectType: string;
  operObjectlink: string;
  operObjectName: string;
  operObjectAddress: string;
  operSubjectName: string;
  operSubjectLink: string;
  operSubjectAddress: string;
  result?: string;
}

/** Локаторы и функции для раздела `Администрирование` –> `Журнал событий`. */
export default class LogsPage {
  readonly page: Page;
  readonly helper: Helper;

  readonly pageTitle: Locator;

  readonly tabs: {
    readonly eventLogs: Locator;
    readonly informationSecurityLogs: Locator;
    readonly navigationLogs: Locator;
    readonly apiEventLogs: Locator;
  };

  readonly table: Components.Table;

  constructor(page: Page, helper: Helper) {
    this.page = page;
    this.helper = helper;

    this.pageTitle = page.locator(':above(.etl-main-tables-tabs) h2');

    this.tabs = {
      eventLogs: page.locator('[data-node-key=eventLogs]'),
      informationSecurityLogs: page.locator('[data-node-key=isLogs]'),
      navigationLogs: page.locator('[data-node-key=navigationLogs]'),
      apiEventLogs: page.locator('[data-node-key=apiLogs]'),
    };

    this.table = {
      head: page.locator('.ant-table-thead tr'),
      body: page.locator('.ant-table-body'),
    };
  }

  async checkSecurityLogs(logRowID: number = 0, logInfo: LogInfo) {
    const logRow = this.table.body.locator('tr.ant-table-row').nth(logRowID).locator('td');
    // Событие
    await expect(logRow.nth(0)).toHaveText(logInfo.event);
    // Время
    expect(
      Math.abs(logInfo.time.diff(dayjs(await logRow.nth(1).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'second'))
    ).toBeLessThanOrEqual(7);
    // Параметры
    await expect(logRow.nth(2).locator('ul li')).toHaveText(logInfo.options);
    // Адрес пользователя
    expect(await logRow.nth(3).textContent()).toMatch(this.helper.regexMasks.ipv4);
    // Имя сервера
    await expect(logRow.nth(4)).not.toBeEmpty();
    // Уровень важности
    await expect(logRow.nth(5)).toHaveText(logInfo.importanceLevel);
    // Сообщение
    await expect(logRow.nth(6)).toHaveText(logInfo.message);
    // Раздел
    await expect(logRow.nth(7)).toHaveText(logInfo.section);
    // Oбъект операции
    await expect(logRow.nth(8)).toHaveText(`${logInfo.operObjectType}: ${logInfo.operObjectName}`);
    await expect(logRow.nth(8).locator(`ul li a[href="${logInfo.operObjectlink}"]`)).toHaveText(logInfo.operObjectName);
    // Адрес объекта операции
    await expect(logRow.nth(9)).toHaveText(logInfo.operObjectAddress);
    // Субъект операции
    await expect(logRow.nth(10).locator('a[href*="/admin/users/edit/"]')).toHaveText(logInfo.operSubjectName);
    // Адрес субъекта операции
    expect(await logRow.nth(11).textContent()).toMatch(this.helper.regexMasks.guid);
    // Результат операции
    await expect(logRow.nth(12)).toHaveText(logInfo.result || 'Success');
  }
}
