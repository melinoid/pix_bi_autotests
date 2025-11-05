import { LogInfo } from '../../pages/adminPages/page.logs';
import { userFilterMapping } from '../../pages/page.common';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe('Действия с правилами распределения лицензий', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
    await test.step('Переходим в раздел "Администрирование"', async () => {
      await commonPage.sideMenu.adminBtn.click();
    });
    await test.step('Переходим в подраздел "Распределение лицензий"', async () => {
      await commonPage.adminLinksMenu.licenseRulesLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
  });

  /* Create: 31.10.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13084

  1. Открыть подраздел “Распределение лицензий”
  – Подраздел открыт
  2. Нажать “Новое правило”
  – Открыта страница настройки правил распределения лицензий
  3. Заполнить поле “Название”
  – Поле заполнено
  4. Убедиться, что чек-бокс "Включено" включен
  – Чек-бокс включен
  5. Убедиться, что чек-бокс "Применять к новым пользователям" включен
  – Лицензия выбрана и отображается в поле
  6. В дропдауне "Тип лицензии" выбрать тип лицензии
  – Лицензия выбрана и отображается в поле
  7. Задать правило распределения
  – Поля заполнены
  8. Нажать "Создать"
  – Отображается уведомление
  – Открыт подраздел "Распределение лицензий"
  – Распределение лицензий создано и отображается в списке распределений
  9. Перейти в подраздел “Журнал событий”
  – Открыт “Журнал событий”
  10. Перейти на вкладку “События Информационной Безопасности”
  – Отображаются “События Информационной Безопасности”
  11. Проверить запись "LicenseRule Created"
  – Присутствует запись о создании правила распределения лицензий
  – В колонке “Объект операции” указано созданное правило
  – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка */

  test('6.2.1. Создание распределения лицензий', async ({
    page,
    commonPage,
    licenseRulesPage,
    logsPage,
    helper,
    data,
  }) => {
    let licenseRuleCreationDate: Dayjs;
    let licenseRuleId: string | null;

    await test.step('Переходим к созданию правила распределения', async () => {
      await licenseRulesPage.createRuleBtn.click();
    });
    await test.step('Заполняем форму правила распределения', async () => {
      await licenseRulesPage.rulePage.nameField.input.fill(data.license_rule_uno.name);
      await licenseRulesPage.rulePage.descriptionField.textarea.fill(data.license_rule_uno.description);
      if (!data.license_rule_uno.enabled) {
        await licenseRulesPage.rulePage.enabledCheckbox.checkbox.click();
      }
      if (!data.license_rule_uno.new_user_apply) {
        await licenseRulesPage.rulePage.newUserApplyCheckbox.checkbox.click();
      }
      await licenseRulesPage.rulePage.licenseTypeField.input.click();
      await licenseRulesPage.rulePage.licenseTypeField.dropdown
        .locator(`:text-is("${data.license_rule_uno.license_type}")`)
        .click();
      await commonPage.fillUserFilter(data.license_rule_uno.user_filter);
    });
    await test.step('Создаём правило распределения ', async () => {
      await licenseRulesPage.rulePage.createBtn.click();
      licenseRuleCreationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(licenseRulesPage.rulePage.actionAlert).toBeInViewport({ timeout: 30000 });
      await page.waitForLoadState('load');
      await expect(licenseRulesPage.table.head).toBeVisible();
    });
    await test.step('Ищем созданное правило', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(data.license_rule_uno.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(licenseRulesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданное правило', async () => {
      const licenseRuleRow = licenseRulesPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(licenseRuleRow.nth(0)).toHaveText(data.license_rule_uno.name);
      // Описание
      await expect(licenseRuleRow.nth(1)).toHaveText(data.license_rule_uno.description);
      // Включена
      await expect(licenseRuleRow.nth(2)).toHaveText(data.license_rule_uno.enabled ? 'Да' : 'Нет');
      // Применять только к новым пользователям
      await expect(licenseRuleRow.nth(3)).toHaveText(data.license_rule_uno.new_user_apply ? 'Да' : 'Нет');
      // Тип лицензии
      await expect(licenseRuleRow.nth(4)).toHaveText(data.license_rule_uno.license_type);
      // Фильтр пользователей
      const filterText = function (filter: string[][]) {
        let localeFilter: string[] = [];
        for (let i in filter) {
          let row = +i;
          if (filter[row].length > 1) {
            localeFilter.push(
              userFilterMapping.type[filter[row][0] as keyof typeof userFilterMapping.type] +
                ' ' +
                userFilterMapping.filter[filter[row][1] as keyof typeof userFilterMapping.filter] +
                (filter[row][2] ? ` ${filter[row][2]}` : '')
            );
          }
        }
        return localeFilter;
      };
      await expect(licenseRuleRow.nth(5).locator('ul li')).toHaveText(filterText(data.license_rule_uno.user_filter));
      // Дата создания
      expect(
        Math.abs(
          licenseRuleCreationDate.diff(
            dayjs(await licenseRuleRow.nth(6).textContent(), 'DD.MM.YYYY HH:mm:ss'),
            'second'
          )
        )
      ).toBeLessThanOrEqual(1);
      // Элементы управления
      await expect(licenseRuleRow.locator('button').nth(0)).toBeVisible();
      await expect(licenseRuleRow.locator('button').nth(1)).toBeVisible();

      // Вытягиваем ID созданного правила из ссылки
      await licenseRuleRow.locator('button').nth(0).click();
      licenseRuleId = page.url().split('/license-rules/')[1];
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие создания правила', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'License rule created' }).click();
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page
          .locator('input[data-testid*=table-search-input]')
          .last()
          .fill(licenseRuleId + '');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden();

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог создания правила', async () => {
        const userDeleteLogInfo: LogInfo = {
          event: 'LicenseRuleCreated',
          time: licenseRuleCreationDate,
          options: [
            'Имя параметра: Name',
            `Значение: ${data.license_rule_uno.name}`,
            'Имя параметра: Description',
            `Значение: ${data.license_rule_uno.description}`,
            'Имя параметра: Enable',
            `Значение: ${data.license_rule_uno.enabled ? 'True' : 'False'}`,
            'Имя параметра: LicenseType',
            `Значение: ${data.license_rule_uno.license_type}`,
            'Имя параметра: ApplyToNewUserOnly',
            `Значение: ${data.license_rule_uno.new_user_apply ? 'True' : 'False'}`,
          ],
          importanceLevel: 'Info',
          message: 'New license rule was created',
          section: 'LicenseRule',
          operObjectType: 'Распределение лицензий',
          operObjectlink: `/admin/license-rules/${licenseRuleId}`,
          operObjectName: data.license_rule_uno.name,
          operObjectAddress: licenseRuleId || '',
          operSubjectName: getMainUser().username,
          operSubjectLink: '/admin/users/edit/',
          operSubjectAddress: '',
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });

  /* Create: 31.10.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13086

    1. Открыть подраздел “Распределение лицензий”
    - Подраздел открыт
    2. Нажать на иконку лупы в правом верхнем углу
    – Открыто поле поиска
    3. Заполнить поле тестовым названием
    – Поле заполнено
    – В списке доступно искомое правило
    4. Проскролить строку тестового правила вправо
    – Доступны иконки “Редактирования” и “Удаления”
    5. Нажать на иконку удаления (корзина)
    – Открыто окно предупреждения
    6. Нажать “Удалить”
    – Правило удалено
    – Открыт подраздел "Распределение лицензий"
    7. Перейти в подраздел “Журнал событий”
    – Открыт “Журнал событий”
    8. Перейти на вкладку “События Информационной Безопасности”
    – Отображаются “События Информационной Безопасности”
    9. Проверить запись "LicenseRuleDeleted"
    – Присутствует запись об удалении правила распределения лицензий
    – В колонке “Объект операции” указано удаленное правило
    – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
    10. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
    – Ссылки кликабельны.
    – Ссылки ведут на корректные ресурсы
    11. Проверить поле “Параметры”
    – В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.2.3. Удаление распределения лицензий', async ({
    page,
    commonPage,
    licenseRulesPage,
    logsPage,
    helper,
    data,
  }) => {
    let licenseRuleId: string | null;
    let licenseRuleDeletionDate: Dayjs;

    await test.step('Ищем созданнoe распределениe лицензий', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(data.license_rule_uno.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(licenseRulesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      // Вытягиваем ID созданного правила из ссылки
      await licenseRulesPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(0)
        .click();
      licenseRuleId = page.url().split('/license-rules/')[1];
      await commonPage.adminLinksMenu.licenseRulesLink.click();
    });
    await test.step('Удаляем распределениe лицензий', async () => {
      await expect(licenseRulesPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').nth(0)).toHaveText(
        data.license_rule_uno.name
      );
      await licenseRulesPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(1)
        .click();

      await test.step('Проверяем модальное окно удаления правила', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          `Вы уверены что хотите удалить правило "${data.license_rule_uno.name}"?`
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-typography')).toHaveText(
          'Это действие нельзя отменить.'
        );
      });

      await commonPage.deleteModal.applyBtn.click();
      licenseRuleDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем отсутствие распределения лицензий', async () => {
      await expect(licenseRulesPage.table.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие удаления распределения лицензий', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'License rule deleted' }).click();
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page
          .locator('input[data-testid*=table-search-input]')
          .last()
          .fill(licenseRuleId + '');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden();

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог удаления распределения лицензий', async () => {
        const userDeleteLogInfo: LogInfo = {
          event: 'LicenseRuleDeleted',
          time: licenseRuleDeletionDate,
          options: ['Имя параметра: Name', `Значение: ${data.license_rule_uno.name}`],
          importanceLevel: 'Warn',
          message: 'Deleted',
          section: 'LicenseRule',
          operObjectType: 'Распределение лицензий',
          operObjectlink: `/admin/license-rules/${licenseRuleId}`,
          operObjectName: data.license_rule_uno.name,
          operObjectAddress: licenseRuleId || '',
          operSubjectName: getMainUser().username,
          operSubjectLink: '/admin/users/edit/',
          operSubjectAddress: '',
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });
});
