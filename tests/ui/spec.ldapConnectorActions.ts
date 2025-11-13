import { userFilterMapping } from '../../pages/page.common';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
import Helper from '../../utils/helper';
import { LDAP } from '../../data/data';
import { rewriteData, writeData } from '../../data/data.common';
import LDAPConnectorsTD from '../../data/data.ldapConnector';
import { SecurityLogInfo } from '../../pages/adminPages/page.logs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe.serial('Действия с LDAP импортом пользователей', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }, testInfo) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser(testInfo.parallelIndex));
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
  }, testInfo) => {
    test.slow(); // Иногда импорт пользователей провисает

    const mainUser = getMainUser(testInfo.parallelIndex);
    let ldapConnector: LDAP = await LDAPConnectorsTD.createLDAPConnector();
    let ldapConnectorCreationDate: Dayjs;

    await test.step('Переходим к созданию импорта пользователей', async () => {
      await usersImportPage.createImportBtn.click();

      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot('ldapImportPage.png', {
        animations: 'allow',
        caret: 'hide',
        maxDiffPixelRatio: 0.01,
        scale: 'css',
      });
    });
    await test.step('Заполняем форму импорта пользователей', async () => {
      await expect(usersImportPage.ldapImportPage.pageTitle).toHaveText('Создать подключение');
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
        .locator(`:text-is("${ldapConnector.protocol_version}")`)
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
      await page.keyboard.press('Enter');
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
      await expect(ldapconnectorRow.nth(9)).toHaveText(ldapConnector.protocol_version.slice(-1));
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

      // Вытягиваем ID созданного импорта из ссылки
      await ldapconnectorRow.locator('button').nth(0).click();
      ldapConnector.id = page.url().split('/user-connector/')[1];

      // Записываем коннектор для дальнейших тестов
      writeData('ldap_connector_crud', ldapConnector);
    });
    await test.step('Переходим в подраздел "Пользователи"', async () => {
      await commonPage.adminLinksMenu.usersLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 20000 });
    });
    await test.step('Запускаем импорт пользователей', async () => {
      await commonPage.refreshBtn.click();
      await expect(page.locator('.ant-notification-notice-closable .ant-notification-notice-message')).toHaveText(
        'Выполняется импорт Пользователей из AD, это может занять некоторое время'
      );
      try {
        await expect(page.locator('.ant-notification-notice-closable')).toBeHidden({ timeout: 120000 });
      } catch (e) {
        throw Error('Слишком долгий импорт, необходимо удалить прочие импорты или проверить работу импорта.');
      }
    });
    await test.step('Проверяем импортированных пользователей', async () => {
      await usersPage.table.head.locator('th.ant-table-cell').nth(15).locator('button').nth(1).click();
      await page.locator('.ant-popover-inner input[type=text]').fill(ldapConnector.name);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      await expect(commonPage.contentLoader).toBeHidden();
      await expect(usersPage.table.body.locator('tr.ant-table-row')).toHaveCount(2);

      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(2)')).toHaveText(['UGPN31', 'UGPN32']);
      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(3)')).toHaveText(['UGPN31', 'UGPN32']);
      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(5)')).toHaveText(['Да', 'Да']);
      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(6)')).toHaveText(['', '']);
      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(7)').nth(0)).toContainText('GGPN31');
      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(7)').nth(1)).toContainText('GGPN31');
      await expect(usersPage.table.body.locator('tr.ant-table-row td:nth-child(9)')).toHaveText(['Нет', 'Нет']);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      let ldapConnectorLogID = -1;

      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 20000 });
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
        await test.step('Проверяем лог удаления распределения лицензий', async () => {
          const ldapConnectorCreateLogInfo: SecurityLogInfo = {
            event: 'LdapConnectionCreated',
            time: ldapConnectorCreationDate,
            options: [
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
              `Значение: ${ldapConnector.protocol_version.slice(-1)}`,
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
            ],
            importanceLevel: 'Warn',
            message: 'LDAP users connector was created',
            section: 'UserConnector',
            operObjectType: 'Импорт пользователей',
            operObjectlink: `/admin/user-connector/${ldapConnector.id}`,
            operObjectName: ldapConnector.name,
            operObjectAddress: `${ldapConnector.id}`,
            operSubjectAddress: mainUser.id,
            operSubjectName: mainUser.username,
          };
          await logsPage.checkSecurityLogs(ldapConnectorLogID, ldapConnectorCreateLogInfo);
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
            throw Error(`Не удалось найти лог импорта: ${ldapConnector.name}`);
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
          await expect(logRow.nth(10).locator('a[href*="/admin/users/edit/"]')).toHaveText(mainUser.username);
          // Адрес субъекта операции
          expect(await logRow.nth(11).textContent()).toMatch(helper.regexMasks.guid);
          // Результат операции
          await expect(logRow.nth(12)).toHaveText('Success');
        });
      });
    });
  });

  /* Create: 01.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?folderId=2653&selected=13078

  1. Открыть подраздел “Импорт пользователей”
  – Подраздел открыт на вкладке "Ldap"
  2. Проскроллить список вправо (ctrl + скролл вниз)
  - Список проскроллен
  3. Нажать на иконку карандаша в строке с произвольным подключением
  - Открыло окно редактирования пользователя
  4. Изменить произвольные параметры в окне редактирования
  - Параметры изменены
  5. Нажать “Сохранить”
  - Поле “Пароль AD” горит красным, под ним появилась надпись “Обязательное поле!”
  6. Ввести пароль для юзера AD
  - Пароль введён
  7. Нажать “Сохранить”
  - Изменения сохранены и отображаются в списке подключений
  8. Перейти в подраздел “Журнал событий”
  - Открыт “Журнал событий”
  9. Перейти на вкладку “События Информационной Безопасности”
  - Отображаются “События Информационной Безопасности”
  10. Проверить запись “LdapConnectionEdited”
  - В новой записи, в колонке “Объект операции” указано измененное подключение
  - В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  11. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  - Ссылки кликабельны
  - Ссылки ведут на корректные ресурсы
  12. Проверить поле “Параметры”
  - В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.1.8. Редактирование импорта пользователей', async ({
    page,
    commonPage,
    usersImportPage,
    logsPage,
    data,
  }, testInfo) => {
    test.slow(); // Иногда импорт пользователей провисает

    const mainUser = getMainUser(testInfo.parallelIndex);
    let oldLdapConnector = data.ldap_connector_crud;
    let newLdapConnector: LDAP = await LDAPConnectorsTD.createFakeLDAPConnector();
    let ldapConnectorModificationDate: Dayjs;

    await test.step('Ищем подходящий ldap импорт', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(oldLdapConnector.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersImportPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);

      await expect(page).toHaveScreenshot('ldapConnectorsPage.png', {
        animations: 'allow',
        caret: 'hide',
        maxDiffPixelRatio: 0.01,
        scale: 'css',
      });
    });
    await test.step('Переходим к изменению импорта', async () => {
      await usersImportPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(0)
        .click();
    });
    await test.step('Заполняем форму импорта пользователей', async () => {
      await expect(usersImportPage.ldapImportPage.pageTitle).toHaveText(
        `Редактировать подключение ${oldLdapConnector.name}`
      );
      await usersImportPage.ldapImportPage.nameField.input.fill(newLdapConnector.name);
      await usersImportPage.ldapImportPage.descriptionField.input.fill(`${newLdapConnector.description}`);

      const eChecked = await usersImportPage.ldapImportPage.enabledToggle.toggle.isChecked();
      if ((!eChecked && newLdapConnector.enabled) || (eChecked && !newLdapConnector.enabled)) {
        await usersImportPage.ldapImportPage.enabledToggle.toggle.click();
      }

      const lChecked = await usersImportPage.ldapImportPage.lazyToggle.toggle.isChecked();
      if ((!lChecked && newLdapConnector.lazy_import) || (lChecked && !newLdapConnector.lazy_import)) {
        await usersImportPage.ldapImportPage.lazyToggle.toggle.click();
      }

      const adChecked = await usersImportPage.ldapImportPage.activeDirectoryToggle.toggle.isChecked();
      if ((!adChecked && newLdapConnector.active_directory) || (adChecked && !newLdapConnector.active_directory)) {
        await usersImportPage.ldapImportPage.activeDirectoryToggle.toggle.click();
      }

      await usersImportPage.ldapImportPage.serverField.input.fill(newLdapConnector.server);
      await usersImportPage.ldapImportPage.portField.input.fill(newLdapConnector.port);
      await usersImportPage.ldapImportPage.connectionTypeField.input.click();
      await usersImportPage.ldapImportPage.connectionTypeField.dropdown
        .locator(`:text-is("${newLdapConnector.connection_type}")`)
        .click();
      await usersImportPage.ldapImportPage.adUserField.input.fill(newLdapConnector.ad_user);
      await usersImportPage.ldapImportPage.adPasswordField.input.fill(newLdapConnector.ad_password);
      await usersImportPage.ldapImportPage.domainField.input.fill(`${newLdapConnector.domain}`);

      const sslChecked = await usersImportPage.ldapImportPage.sslToggle.toggle.isChecked();
      if ((!sslChecked && newLdapConnector.enabled) || (sslChecked && !newLdapConnector.enabled)) {
        await usersImportPage.ldapImportPage.sslToggle.toggle.click();
      }
      const tlsChecked = await usersImportPage.ldapImportPage.tlsToggle.toggle.isChecked();
      if ((!tlsChecked && newLdapConnector.enabled) || (tlsChecked && !newLdapConnector.enabled)) {
        await usersImportPage.ldapImportPage.tlsToggle.toggle.click();
      }

      await usersImportPage.ldapImportPage.searchBaseField.input.fill(newLdapConnector.search_base);
      await usersImportPage.ldapImportPage.adQueryField.textarea.fill(newLdapConnector.ad_query);
      await usersImportPage.ldapImportPage.adSyncGroupsField.textarea.fill(`${newLdapConnector.sync_groups}`);
      await usersImportPage.ldapImportPage.ldapProtocolField.input.click();
      await usersImportPage.ldapImportPage.ldapProtocolField.dropdown
        .locator(`:text-is("${newLdapConnector.protocol_version}")`)
        .click();
      await usersImportPage.ldapImportPage.timeoutField.input.clear();
      await usersImportPage.ldapImportPage.timeoutField.input.fill(newLdapConnector.timeout);

      // Изменяем крон
      const pChecked = await usersImportPage.ldapImportPage.periodicUpdateToggle.toggle.isChecked();
      if (
        (!pChecked && newLdapConnector.periodic_update?.enabled) ||
        (pChecked && !newLdapConnector.periodic_update?.enabled)
      ) {
        await usersImportPage.ldapImportPage.periodicUpdateToggle.toggle.click();
      }
      if (newLdapConnector.periodic_update?.enabled) {
        await usersImportPage.ldapImportPage.periodicUpdateForm.timeZoneField.input.click();
        await usersImportPage.ldapImportPage.periodicUpdateForm.timeZoneField.dropdown
          .locator(`:text-is("${newLdapConnector.periodic_update.timezone}")`)
          .click();
        await usersImportPage.ldapImportPage.periodicUpdateForm.cronField.input.fill(
          `${newLdapConnector.periodic_update.cron}`
        );
      }

      // Изменяем аттрибуты маппинга
      await usersImportPage.ldapImportPage.expandMappingFormHeader.click();
      await usersImportPage.ldapImportPage.mappingForm.displayNameField.input.fill(
        oldLdapConnector.attributes_mapping.display_name
      );
      await usersImportPage.ldapImportPage.mappingForm.emailField.input.fill(oldLdapConnector.attributes_mapping.email);
      await usersImportPage.ldapImportPage.mappingForm.accountNameField.input.fill(
        oldLdapConnector.attributes_mapping.account_name
      );
      await usersImportPage.ldapImportPage.mappingForm.objectSIDField.input.fill(
        oldLdapConnector.attributes_mapping.object_sid
      );
      await usersImportPage.ldapImportPage.mappingForm.groupMembershipField.input.fill(
        oldLdapConnector.attributes_mapping.group_membership
      );
      await usersImportPage.ldapImportPage.mappingForm.objectClassField.input.fill(
        oldLdapConnector.attributes_mapping.object_class
      );
      await usersImportPage.ldapImportPage.mappingForm.userObjectClassField.input.fill(
        oldLdapConnector.attributes_mapping.user_object_class
      );
      await usersImportPage.ldapImportPage.mappingForm.groupObjectClassField.input.fill(
        oldLdapConnector.attributes_mapping.group_object_class
      );
    });
    await test.step('Сохраняем изменения импорта пользователей ', async () => {
      await usersImportPage.ldapImportPage.createBtn.click();
      ldapConnectorModificationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(page.locator('.ant-notification-notice-success')).toBeInViewport({ timeout: 60000 });
      await page.waitForLoadState('load');
      await expect(usersImportPage.table.head).toBeVisible();
    });
    await test.step('Ищем изменённый импорт пользователей', async () => {
      await expect(commonPage.contentLoader).toBeHidden();

      await commonPage.searchField.input.clear();
      await commonPage.searchField.input.fill(newLdapConnector.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersImportPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданный импорт пользователей', async () => {
      const ldapconnectorRow = usersImportPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(ldapconnectorRow.nth(0)).toHaveText(newLdapConnector.name);
      // Описание
      await expect(ldapconnectorRow.nth(1)).toHaveText(`${newLdapConnector.description}`);
      // Включен
      await expect(ldapconnectorRow.nth(2)).toHaveText(newLdapConnector.enabled ? 'Дa' : 'Нет');
      // Сервер
      await expect(ldapconnectorRow.nth(3)).toHaveText(newLdapConnector.server);
      // Порт
      await expect(ldapconnectorRow.nth(4)).toHaveText(newLdapConnector.port);
      // Пользователь AD
      await expect(ldapconnectorRow.nth(5)).toHaveText(newLdapConnector.ad_user);
      // Домен
      await expect(ldapconnectorRow.nth(6)).toHaveText(`${newLdapConnector.domain}`);
      // SSL
      await expect(ldapconnectorRow.nth(7)).toHaveText(newLdapConnector.ssl ? 'Дa' : 'Нет');
      // TLS
      await expect(ldapconnectorRow.nth(8)).toHaveText(newLdapConnector.tls ? 'Дa' : 'Нет');
      // Протокол LDAP
      await expect(ldapconnectorRow.nth(9)).toHaveText(newLdapConnector.protocol_version.slice(-1));
      // Способ подключения
      await expect(ldapconnectorRow.nth(10)).toHaveText(newLdapConnector.connection_type);
      // База поиска
      await expect(ldapconnectorRow.nth(11)).toHaveText(newLdapConnector.search_base);
      // AD запрос
      await expect(ldapconnectorRow.nth(12)).toHaveText(newLdapConnector.ad_query);
      // Регламент
      if (newLdapConnector.periodic_update?.enabled) {
        await expect(ldapconnectorRow.nth(13)).toContainText('Каждый(ую)');
      } else {
        await expect(ldapconnectorRow.nth(13)).toBeEmpty();
      }

      // Элементы управления
      await expect(ldapconnectorRow.locator('button').nth(0)).toBeVisible();
      await expect(ldapconnectorRow.locator('button').nth(1)).toBeVisible();

      // Записываем коннектор для дальнейших тестов
      newLdapConnector.id = oldLdapConnector.id;
      rewriteData('ldap_connector_crud', newLdapConnector);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      let ldapConnectorLogID = -1;

      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 20000 });
      });
      await test.step('Ищем событие создания импортa пользователей', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'LDAP connection edited' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${oldLdapConnector.id}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);

        await test.step('Проверяем лог удаления распределения лицензий', async () => {
          const updOptions = function (newLdap: LDAP, oldLdap: LDAP) {
            let options = [];
            if (newLdap.name !== oldLdap.name) {
              options.push(
                'Имя параметра: Name',
                `Старое значение: ${oldLdap.name}`,
                `Новое значение: ${newLdap.name}`
              );
            }
            if (newLdap.enabled !== oldLdap.enabled) {
              options.push(
                'Имя параметра: IsEnabled',
                `Старое значение: ${Helper.capitalize(oldLdap.enabled + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.enabled + '')}`
              );
            }
            if (newLdap.active_directory !== oldLdap.active_directory) {
              options.push(
                'Имя параметра: IsActiveDirectory',
                `Старое значение: ${Helper.capitalize(oldLdap.active_directory + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.active_directory + '')}`
              );
            }
            if (newLdap.lazy_import !== oldLdap.lazy_import) {
              options.push(
                'Имя параметра: UseLazyLoad',
                `Старое значение: ${Helper.capitalize(oldLdap.lazy_import + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.lazy_import + '')}`
              );
            }
            if (newLdap.server !== oldLdap.server) {
              options.push(
                'Имя параметра: Server',
                `Старое значение: ${oldLdap.server}`,
                `Новое значение: ${newLdap.server}`
              );
            }
            if (newLdap.port !== oldLdap.port) {
              options.push(
                'Имя параметра: Port',
                `Старое значение: ${oldLdap.port}`,
                `Новое значение: ${newLdap.port}`
              );
            }
            if (newLdap.ad_user !== oldLdap.ad_user) {
              options.push(
                'Имя параметра: User',
                `Старое значение: ${oldLdap.ad_user}`,
                `Новое значение: ${newLdap.ad_user}`
              );
            }
            if (newLdap.domain !== oldLdap.domain) {
              options.push(
                'Имя параметра: Domain',
                `Старое значение: ${oldLdap.domain}`,
                `Новое значение: ${newLdap.domain}`
              );
            }
            if (newLdap.ssl !== oldLdap.ssl) {
              options.push(
                'Имя параметра: IsSsl',
                `Старое значение: ${Helper.capitalize(oldLdap.ssl + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.ssl + '')}`
              );
            }
            if (newLdap.tls !== oldLdap.tls) {
              options.push(
                'Имя параметра: IsSsl',
                `Старое значение: ${Helper.capitalize(oldLdap.tls + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.tls + '')}`
              );
            }
            if (newLdap.protocol_version !== oldLdap.protocol_version) {
              options.push(
                'Имя параметра: ProtocolVersion',
                `Старое значение: ${oldLdap.protocol_version.slice(-1)}`,
                `Новое значение: ${newLdap.protocol_version.slice(-1)}`
              );
            }
            if (newLdap.search_base !== oldLdap.search_base) {
              options.push(
                'Имя параметра: SearchBase',
                `Старое значение: ${oldLdap.search_base}`,
                `Новое значение: ${newLdap.search_base}`
              );
            }
            if (newLdap.ad_query !== oldLdap.ad_query) {
              options.push(
                'Имя параметра: Query',
                `Старое значение: ${oldLdap.ad_query}`,
                `Новое значение: ${newLdap.ad_query}`
              );
            }
            if (newLdap.sync_groups !== oldLdap.sync_groups) {
              options.push(
                'Имя параметра: UserGroupQuery',
                `Старое значение: ${oldLdap.sync_groups}`,
                `Новое значение: ${newLdap.sync_groups}`
              );
            }
            if (newLdap.timeout !== oldLdap.timeout) {
              options.push(
                'Имя параметра: Timeout',
                `Старое значение: ${oldLdap.timeout}`,
                `Новое значение: ${newLdap.timeout}`
              );
            }
            if (newLdap.description !== oldLdap.description) {
              options.push(
                'Имя параметра: Description',
                `Старое значение: ${oldLdap.description}`,
                `Новое значение: ${newLdap.description}`
              );
            }
            if (newLdap.periodic_update?.enabled !== oldLdap.periodic_update?.enabled) {
              options.push(
                'Имя параметра: CronSettings IsEnabled',
                `Старое значение: ${Helper.capitalize(oldLdap.periodic_update?.enabled + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.periodic_update?.enabled + '')}`
              );
            }
            if (
              newLdap.periodic_update?.timezone !== oldLdap.periodic_update?.timezone &&
              newLdap.periodic_update?.enabled !== oldLdap.periodic_update?.enabled
            ) {
              options.push(
                'Имя параметра: CronSettings TimeZone',
                `Старое значение: ${Helper.capitalize(oldLdap.periodic_update?.timezone + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.periodic_update?.timezone + '')}`
              );
            }
            if (
              newLdap.periodic_update?.cron !== oldLdap.periodic_update?.cron &&
              newLdap.periodic_update?.enabled !== oldLdap.periodic_update?.enabled
            ) {
              options.push(
                'Имя параметра: CronSettings Expression',
                `Старое значение: ${Helper.capitalize(oldLdap.periodic_update?.cron + '')}`,
                `Новое значение: ${Helper.capitalize(newLdap.periodic_update?.cron + '')}`
              );
            }
            return options;
          };

          const ldapConnectorCreateLogInfo: SecurityLogInfo = {
            event: 'LdapConnectionEdited',
            time: ldapConnectorModificationDate,
            options: updOptions(newLdapConnector, oldLdapConnector),
            importanceLevel: 'Warn',
            message: 'LDAP users connector was updated',
            section: 'UserConnector',
            operObjectType: 'Импорт пользователей',
            operObjectlink: `/admin/user-connector/${oldLdapConnector.id}`,
            operObjectName: newLdapConnector.name,
            operObjectAddress: `${oldLdapConnector.id}`,
            operSubjectAddress: mainUser.id,
            operSubjectName: mainUser.username,
          };
          await logsPage.checkSecurityLogs(ldapConnectorLogID, ldapConnectorCreateLogInfo);
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
    data,
  }, testInfo) => {
    const mainUser = getMainUser(testInfo.parallelIndex);
    let ldapConnector: LDAP = data.ldap_connector_crud;
    let ldapConnectorDeletionDate: Dayjs;

    await test.step('Ищем созданный ldap импорт', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(ldapConnector.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersImportPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);

      await expect(page).toHaveScreenshot('ldapImportsPage.png', {
        animations: 'allow',
        caret: 'hide',
        maxDiffPixelRatio: 0.01,
        scale: 'css',
      });
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

      try {
        await test.step('Проверяем модальное окно удаления импорта', async () => {
          await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
            `При удалении ${ldapConnector.name} будут удалены 2 импортированных пользователей`
          );
        });
      } catch (e) {
        console.warn('Пользователи не были импортированы через LDAP.');
        await test.step('Проверяем модальное окно удаления импорта', async () => {
          await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
            `При удалении ${ldapConnector.name} будут удалены 0 импортированных пользователей`
          );
        });
      }

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
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 20000 });
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
        await test.step('Проверяем лог удаления распределения лицензий', async () => {
          const ldapConnectorCreateLogInfo: SecurityLogInfo = {
            event: 'LdapConnectionDeleted',
            time: ldapConnectorDeletionDate,
            options: ['Имя параметра: Name', `Значение: ${ldapConnector.name}`],
            importanceLevel: 'Warn',
            message: 'LDAP users connector was deleted',
            section: 'UserConnector',
            operObjectType: 'Импорт пользователей',
            operObjectlink: `/admin/user-connector/${ldapConnector.id}`,
            operObjectName: ldapConnector.name,
            operObjectAddress: `${ldapConnector.id}`,
            operSubjectAddress: mainUser.id,
            operSubjectName: mainUser.username,
          };
          await logsPage.checkSecurityLogs(0, ldapConnectorCreateLogInfo);
        });
      });
    });
  });
});
