import { userFilterMapping } from '../../pages/page.common';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
import Helper from '../../utils/helper';
import { LDAP } from '../../data/data';
import { rewriteData } from '../../data/data.common';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe('Действия с LDAP импортом пользователей', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
    await test.step('Переходим в раздел "Администрирование"', async () => {
      await commonPage.sideMenu.adminBtn.click();
    });
    await test.step('Переходим в подраздел "Импорт пользователей"', async () => {
      await commonPage.adminLinksMenu.usersImportLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
  });

  /* Create: 01.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13077

  1. Открыть подраздел “Импорт пользователей”
  – Подраздел открыт на вкладке "Ldap"
  2. Нажать “Создать подключение”
  - Открыта страница “Создать подключение”
  3. Выбрать тип "Ldap"
  - Свитчер включен на "LDAP":
  4. Заполнить поле “Имя”
  - Поле заполнено
  5. Убедиться, что тумблер "Включено" включен
  - Тоггл включен
  6. Выключить тумблер “Ленивый импорт”
  - Тоггл выключен
  7. Убедиться, что тумблер "Active Directory" включен
  - Тоггл включен
  8. Заполнить все поля, указанные в кредах
  - Поля активны, данные введены
  9. Нажать "Сохранить"
  - Появляется уведомление
  - Открыт подраздел "Импорт пользователей"
  - Импорт пользователей создан
  10. Перейти в раздел "Пользователи"
  11. Нажать на циклическую стрелку «Обновить»
  - Пользователи из созданного подключения появились в списке пользователей
  12. Перейти в подраздел “Журнал событий”
  - Открыт “Журнал событий”
  13. Перейти на вкладку “События Информационной Безопасности”
  - Отображаются “События Информационной Безопасности”
  14. Проверить запись “LdapConnection Created”
  - Присутствует запись о создании LDAP подключения
  - В колонке “Объект операции” указано созданное подключение
  - В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  15. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  - Ссылки кликабельны
  - Ссылки ведут на корректные ресурсы
  16. Проверить поле “Параметры”
  - В поле указаны корректные параметры созданного/отредактированного ресурса
  17. Проверить запись “NewUsersImportedFromAD”
  - В новой записи, в колонке “Объект операции” указаны имена импортированных пользователей
  - В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  18. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  - Ссылки кликабельны
  - Ссылки ведут на корректные ресурсы
  19. Проверить поле “Параметры”
  - В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.1.7. Создание LDAP импорта пользователей', async ({
    page,
    commonPage,
    usersImportPage,
    usersPage,
    logsPage,
    helper,
    data,
  }) => {
    let ldapConnector: LDAP = data.ldap_connector_uno;
    let ldapConnectorCreationDate: Dayjs;

    await test.step('Переходим к созданию импорта пользователей', async () => {
      await usersImportPage.createImportBtn.click();
    });
    await test.step('Заполняем форму импорта пользователей', async () => {
      await usersImportPage.ldapImportPage.nameField.input.fill(ldapConnector.name);
      await usersImportPage.ldapImportPage.descriptionField.input.fill(`${ldapConnector.description}`);
      if (!ldapConnector.enabled) {
        await usersImportPage.ldapImportPage.enabledToggle.toggle.click();
      }
      if (!ldapConnector.lazy_import) {
        await usersImportPage.ldapImportPage.lazyToggle.toggle.click();
      }
      if (!ldapConnector.active_directory) {
        await usersImportPage.ldapImportPage.activeDirectoryToggle.toggle.click();
      }
      await usersImportPage.ldapImportPage.serverField.input.fill(ldapConnector.server);
      await usersImportPage.ldapImportPage.portField.input.fill(ldapConnector.port);
      await usersImportPage.ldapImportPage.connectionTypeField.input.click();
      await usersImportPage.ldapImportPage.connectionTypeField.dropdown
        .locator(`:text-is("${ldapConnector.connection_type}")`)
        .click();
      await usersImportPage.ldapImportPage.adUserField.input.fill(ldapConnector.ad_user);
      await usersImportPage.ldapImportPage.adPasswordField.input.fill(ldapConnector.ad_password);
      await usersImportPage.ldapImportPage.domainField.input.fill(`${ldapConnector.domain}`);
      if (ldapConnector.ssl) {
        await usersImportPage.ldapImportPage.sslToggle.toggle.click();
      }
      if (ldapConnector.tls) {
        await usersImportPage.ldapImportPage.tlsToggle.toggle.click();
      }
      await usersImportPage.ldapImportPage.searchBaseField.input.fill(ldapConnector.search_base);
      await usersImportPage.ldapImportPage.adQueryField.textarea.fill(ldapConnector.ad_query);
      await usersImportPage.ldapImportPage.ldapProtocolField.input.click();
      await usersImportPage.ldapImportPage.ldapProtocolField.dropdown
        .locator(`:text-is("${ldapConnector.ldap_protocol_version}")`)
        .click();
      await usersImportPage.ldapImportPage.timeoutField.input.clear();
      await usersImportPage.ldapImportPage.timeoutField.input.fill(ldapConnector.timeout);

      // Проверим дополнительно аттрибуты маппинга
      await usersImportPage.ldapImportPage.expandMappingFormHeader.click();
      await expect(usersImportPage.ldapImportPage.mappingForm.displayNameField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.display_name}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.emailField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.email}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.accountNameField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.account_name}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.objectSIDField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.object_sid}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.groupMembershipField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.group_membership}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.objectClassField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.object_class}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.userObjectClassField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.user_object_class}`
      );
      await expect(usersImportPage.ldapImportPage.mappingForm.groupObjectClassField.input).toHaveValue(
        `${ldapConnector.attributes_mapping?.group_object_class}`
      );
    });
    await test.step('Создаём импорт пользователей ', async () => {
      await usersImportPage.ldapImportPage.createBtn.click();
      ldapConnectorCreationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(page.locator('.ant-notification-notice-success')).toBeInViewport({ timeout: 60000 });
      await page.waitForLoadState('load');
      await expect(usersImportPage.table.head).toBeVisible();
    });
    await test.step('Ищем созданный импорт пользователей', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(ldapConnector.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersImportPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданный импорт пользователей', async () => {
      const ldapconnectorRow = usersImportPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(ldapconnectorRow.nth(0)).toHaveText(ldapConnector.name);
      // Описание
      await expect(ldapconnectorRow.nth(1)).toHaveText(`${ldapConnector.description}`);
      // Включен
      await expect(ldapconnectorRow.nth(2)).toHaveText(ldapConnector.enabled ? 'Дa' : 'Нет');
      // Сервер
      await expect(ldapconnectorRow.nth(3)).toHaveText(ldapConnector.server);
      // Порт
      await expect(ldapconnectorRow.nth(4)).toHaveText(ldapConnector.port);
      // Пользователь AD
      await expect(ldapconnectorRow.nth(5)).toHaveText(ldapConnector.ad_user);
      // Домен
      await expect(ldapconnectorRow.nth(6)).toHaveText(`${ldapConnector.domain}`);
      // SSL
      await expect(ldapconnectorRow.nth(7)).toHaveText(ldapConnector.ssl ? 'Дa' : 'Нет');
      // TLS
      await expect(ldapconnectorRow.nth(8)).toHaveText(ldapConnector.tls ? 'Дa' : 'Нет');
      // Протокол LDAP
      await expect(ldapconnectorRow.nth(9)).toHaveText(ldapConnector.ldap_protocol_version.slice(-1));
      // Способ подключения
      await expect(ldapconnectorRow.nth(10)).toHaveText(ldapConnector.connection_type);
      // База поиска
      await expect(ldapconnectorRow.nth(11)).toHaveText(ldapConnector.search_base);
      // AD запрос
      await expect(ldapconnectorRow.nth(12)).toHaveText(ldapConnector.ad_query);
      // Регламент
      await expect(ldapconnectorRow.nth(13)).toBeEmpty();

      // Элементы управления
      await expect(ldapconnectorRow.locator('button').nth(0)).toBeVisible();
      await expect(ldapconnectorRow.locator('button').nth(1)).toBeVisible();

      // Вытягиваем ID созданного правила из ссылки
      await ldapconnectorRow.locator('button').nth(0).click();
      ldapConnector.id = page.url().split('/user-connector/')[1];

      // Записываем id директории для дальнейших тестов
      rewriteData('ldap_connector_uno', ldapConnector);
    });
    await test.step('Переходим в подраздел "Пользователи"', async () => {
      await commonPage.adminLinksMenu.usersLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Запускаем импорт пользователей', async () => {
      await commonPage.refreshBtn.click();
      await expect(page.locator('.ant-notification-notice-closable .ant-notification-notice-message')).toHaveText(
        'Выполняется импорт Пользователей из AD, это может занять некоторое время'
      );
      await expect(page.locator('.ant-notification-notice-closable')).toBeHidden({ timeout: 180000 });
    });
    await test.step('Проверяем импортированных пользователей', async () => {
      await usersPage.table.head.locator('th.ant-table-cell').nth(15).locator('button').nth(1).click();
      await page.locator('.ant-popover-inner input[type=text]').fill(data.ldap_connector_uno.name);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      await expect(commonPage.contentLoader).toBeHidden();
      await expect(usersPage.table.body.locator('tr.ant-table-row')).toHaveCount(2);

      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(2)')).toHaveText(['UGPN31', 'UGPN32']);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      let ldapConnectorLogID = -1;

      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие создания импортa пользователей', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'LDAP connection created' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(1).locator('[data-testid*=table-filter]').click();
        await page.locator('input[date-range=start]').fill(dayjs(ldapConnectorCreationDate).format('DD.MM.YYYY'));
        await page.locator('input[date-range=end]').fill(dayjs(ldapConnectorCreationDate).format('DD.MM.YYYY'));
        await page.locator('input[date-range=end]').click();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        // Получаем порядковый номер строки с логом
        const rowCount = await logsPage.table.body.locator('.ant-table-row').count();
        for (let i = 0; i < rowCount; i++) {
          const rowText = (await logsPage.table.body.locator('.ant-table-row').nth(i).textContent())?.includes(
            ldapConnector.name
          );
          if (rowText) {
            ldapConnectorLogID = i;
            break;
          } else {
            throw Error(`Не удалось найти лог создания импорта: ${ldapConnector.name}`);
          }
        }
        await test.step('Проверяем лог создания импорта пользователей', async () => {
          const logRow = logsPage.table.body.locator('tr.ant-table-row').nth(ldapConnectorLogID).locator('td');
          // Событие
          await expect(logRow.nth(0)).toHaveText('LdapConnectionCreated');
          // Время
          expect(
            Math.abs(
              ldapConnectorCreationDate.diff(dayjs(await logRow.nth(1).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'second')
            )
          ).toBeLessThanOrEqual(7);
          // Параметры
          await expect(logRow.nth(2).locator('ul li')).toHaveText([
            'Имя параметра: Name',
            `Значение: ${ldapConnector.name}`,
            'Имя параметра: IsEnabled',
            `Значение: ${Helper.capitalize(ldapConnector.enabled + '')}`,
            'Имя параметра: Server',
            `Значение: ${ldapConnector.server}`,
            'Имя параметра: IsActiveDirectory',
            `Значение: ${Helper.capitalize(ldapConnector.active_directory + '')}`,
            'Имя параметра: UseLazyLoad',
            `Значение: ${Helper.capitalize(ldapConnector.lazy_import + '')}`,
            'Имя параметра: Port',
            `Значение: ${ldapConnector.port}`,
            'Имя параметра: User',
            `Значение: ${ldapConnector.ad_user}`,
            'Имя параметра: Domain',
            `Значение: ${ldapConnector.domain}`,
            'Имя параметра: IsSsl',
            `Значение: ${Helper.capitalize(ldapConnector.ssl + '')}`,
            'Имя параметра: IsTls',
            `Значение: ${Helper.capitalize(ldapConnector.tls + '')}`,
            'Имя параметра: ProtocolVersion',
            `Значение: ${ldapConnector.ldap_protocol_version.slice(-1)}`,
            'Имя параметра: BindType',
            `Значение: ${ldapConnector.connection_type}`,
            'Имя параметра: SearchBase',
            `Значение: ${ldapConnector.search_base}`,
            'Имя параметра: Query',
            `Значение: ${ldapConnector.ad_query}`,
            'Имя параметра: UserGroupQuery',
            `Значение: ${ldapConnector.sync_groups}`,
            'Имя параметра: Timeout',
            `Значение: ${ldapConnector.timeout}`,
            'Имя параметра: Description',
            `Значение: ${ldapConnector.description}`,
            'Имя параметра: CronSettings IsEnabled',
            `Значение: ${Helper.capitalize(`${ldapConnector.periodic_update?.enabled}`)}`,
            'Имя параметра: CronSettings TimeZone',
            `Значение: ${ldapConnector.periodic_update?.timezone}`,
            'Имя параметра: CronSettings Expression',
            `Значение: ${ldapConnector.periodic_update?.cron}`,
          ]);
          // Адрес пользователя
          expect(await logRow.nth(3).textContent()).toMatch(helper.regexMasks.ipv4);
          // Имя сервера
          await expect(logRow.nth(4)).not.toBeEmpty();
          // Уровень важности
          await expect(logRow.nth(5)).toHaveText('Warn');
          // Сообщение
          await expect(logRow.nth(6)).toHaveText('LDAP users connector was created');
          // Раздел
          await expect(logRow.nth(7)).toHaveText('UserConnector');
          // Oбъект операции
          await expect(logRow.nth(8)).toHaveText(`Импорт пользователей: ${ldapConnector.name}`);
          await expect(logRow.nth(8).locator('ul li a[href*="/admin/user-connector/"]')).toHaveText(ldapConnector.name);
          // Адрес объекта операции
          // TODO: не сходятся id созданного коннектора в журнале, нет возможности явно определить строку
          // https://jira.pix.ru/browse/BI-7666
          // await expect(logRow.nth(9)).toHaveText(ldapConnectorId + '');
          // Субъект операции
          await expect(logRow.nth(10).locator('a[href*="/admin/users/edit/"]')).toHaveText(getMainUser().username);
          // Адрес субъекта операции
          expect(await logRow.nth(11).textContent()).toMatch(helper.regexMasks.guid);
          // Результат операции
          await expect(logRow.nth(12)).toHaveText('Success');
        });
      });
      await test.step('Ищем событие импортa пользователей', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'New users imported from AD' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(1).locator('[data-testid*=table-filter]').click();
        await page.locator('input[date-range=start]').fill(dayjs(ldapConnectorCreationDate).format('DD.MM.YYYY'));
        await page.locator('input[date-range=end]').fill(dayjs(ldapConnectorCreationDate).format('DD.MM.YYYY'));
        await page.locator('input[date-range=end]').click();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        // Получаем порядковый номер строки с логом
        const rowCount = await logsPage.table.body.locator('.ant-table-row').count();
        for (let i = 0; i < rowCount; i++) {
          const rowText = (await logsPage.table.body.locator('.ant-table-row').nth(i).textContent())?.includes(
            'UGPN31, UGPN32'
          );
          if (rowText) {
            ldapConnectorLogID = i;
            break;
          } else {
            throw Error(`Не удалось найти лог импорта: ${data.ldap_connector_uno.name}`);
          }
        }
        await test.step('Проверяем лог импорта пользователей', async () => {
          const logRow = logsPage.table.body.locator('tr.ant-table-row').nth(ldapConnectorLogID).locator('td');
          // Событие
          await expect(logRow.nth(0)).toHaveText('NewUsersImportedFromAD');
          // Время
          expect(
            Math.abs(
              ldapConnectorCreationDate.diff(dayjs(await logRow.nth(1).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'minute')
            )
          ).toBeLessThanOrEqual(3);
          // Параметры
          await expect(logRow.nth(2).locator('ul li')).toHaveText([
            'Имя параметра: UserNames',
            `Значение: UGPN31, UGPN32`,
          ]);
          // Адрес пользователя
          expect(await logRow.nth(3).textContent()).toMatch(helper.regexMasks.ipv4);
          // Имя сервера
          await expect(logRow.nth(4)).not.toBeEmpty();
          // Уровень важности
          await expect(logRow.nth(5)).toHaveText('Info');
          // Сообщение
          await expect(logRow.nth(6)).toHaveText('AD users were imported');
          // Раздел
          await expect(logRow.nth(7)).toHaveText('User');
          // Oбъект операции
          // TODO: дублируются объекты в ссылках
          await expect(logRow.nth(8)).toHaveText(`Пользователь: UGPN31, UGPN32UGPN31, UGPN32`);
          await expect(logRow.nth(8).locator('ul li a[href*="/admin/users/edit"]')).toHaveText([
            'UGPN31, UGPN32',
            'UGPN31, UGPN32',
          ]);
          // Адрес объекта операции
          const guids = (await logRow.nth(11).textContent())?.split(', ') || [];
          for (let guid of guids) {
            expect(guid).toMatch(helper.regexMasks.guid);
          }
          // Субъект операции
          await expect(logRow.nth(10).locator('a[href*="/admin/users/edit/"]')).toHaveText(getMainUser().username);
          // Адрес субъекта операции
          expect(await logRow.nth(11).textContent()).toMatch(helper.regexMasks.guid);
          // Результат операции
          await expect(logRow.nth(12)).toHaveText('Success');
        });
      });
    });
  });

  /* Create: 01.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13079

  1. Открыть подраздел “Импорт пользователей”
  – Подраздел открыт на вкладке "Ldap"
  2. Проскроллить список вправо (ctrl + скролл вниз)
  – Список проскроллен
  3. Нажать на иконку корзины в строке с произвольным ресурсом
  – Отрыто модельное окно
  – Если удаляемым импортом в системе были созданы пользователи, то их кол-во отображается в окне
  4. Нажать “Удалить”
  – Импорт удалён и более не отображается в списке
  – Импортированные пользователи так же удалены, если не привязаны к дополнительным импортам */

  test('6.1.12. Удаление импорта пользователей', async ({
    page,
    commonPage,
    usersImportPage,
    logsPage,
    helper,
    data,
  }) => {
    let ldapConnector: LDAP = data.ldap_connector_uno;
    let ldapConnectorDeletionDate: Dayjs;

    await test.step('Ищем созданный ldap импорт', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(ldapConnector.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersImportPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Удаляем импорт пользователей', async () => {
      await expect(usersImportPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').nth(0)).toHaveText(
        ldapConnector.name
      );
      await usersImportPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(1)
        .click();

      await test.step('Проверяем модальное окно удаления импорта', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          `При удалении ${ldapConnector.name} будут удалены 2 импортированных пользователей`
        );
      });

      await commonPage.deleteModal.applyBtn.click();
      ldapConnectorDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем отсутствие импорта пользователей', async () => {
      await expect(usersImportPage.table.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      let ldapConnectorLogID = -1;

      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие удаления импортa пользователей', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'LDAP connection deleted' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(1).locator('[data-testid*=table-filter]').click();
        await page.locator('input[date-range=start]').fill(dayjs(ldapConnectorDeletionDate).format('DD.MM.YYYY'));
        await page.locator('input[date-range=end]').fill(dayjs(ldapConnectorDeletionDate).format('DD.MM.YYYY'));
        await page.locator('input[date-range=end]').click();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        // Получаем порядковый номер строки с логом
        const rowCount = await logsPage.table.body.locator('.ant-table-row').count();
        for (let i = 0; i < rowCount; i++) {
          const rowText = (await logsPage.table.body.locator('.ant-table-row').nth(i).textContent())?.includes(
            ldapConnector.name
          );
          if (rowText) {
            ldapConnectorLogID = i;
            break;
          } else {
            throw Error(`Не удалось найти лог удаления импорта: ${ldapConnector.name}`);
          }
        }
        await test.step('Проверяем лог удаления импорта пользователей', async () => {
          const logRow = logsPage.table.body.locator('tr.ant-table-row').nth(ldapConnectorLogID).locator('td');
          // Событие
          await expect(logRow.nth(0)).toHaveText('LdapConnectionDeleted');
          // Время
          expect(
            Math.abs(
              ldapConnectorDeletionDate.diff(dayjs(await logRow.nth(1).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'second')
            )
          ).toBeLessThanOrEqual(7);
          // Параметры
          await expect(logRow.nth(2).locator('ul li')).toHaveText([
            'Имя параметра: Name',
            `Значение: ${ldapConnector.name}`,
          ]);
          // Адрес пользователя
          expect(await logRow.nth(3).textContent()).toMatch(helper.regexMasks.ipv4);
          // Имя сервера
          await expect(logRow.nth(4)).not.toBeEmpty();
          // Уровень важности
          await expect(logRow.nth(5)).toHaveText('Warn');
          // Сообщение
          await expect(logRow.nth(6)).toHaveText('LDAP users connector was deleted');
          // Раздел
          await expect(logRow.nth(7)).toHaveText('UserConnector');
          // Oбъект операции
          await expect(logRow.nth(8)).toHaveText(`Импорт пользователей: ${ldapConnector.name}`);
          await expect(logRow.nth(8).locator('ul li a[href*="/admin/user-connector/"]')).toHaveText(ldapConnector.name);
          // Адрес объекта операции
          // TODO: не сходятся id созданного коннектора в журнале, нет возможности явно определить строку
          // https://jira.pix.ru/browse/BI-7666
          // await expect(logRow.nth(9)).toHaveText(ldapConnectorId + '');
          // Субъект операции
          await expect(logRow.nth(10).locator('a[href*="/admin/users/edit/"]')).toHaveText(getMainUser().username);
          // Адрес субъекта операции
          expect(await logRow.nth(11).textContent()).toMatch(helper.regexMasks.guid);
          // Результат операции
          await expect(logRow.nth(12)).toHaveText('Success');
        });
      });
    });
  });
});
