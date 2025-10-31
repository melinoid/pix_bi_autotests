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

  /* Create: 31.09.2025

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
  – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
 */

  test('6.2.1. Создание распределения лицензий', async ({ page, commonPage, licenseRulesPage, logsPage, helper, data }) => {
    let groupCreationDate: Dayjs;
    let groupId: string | null;

    await test.step('Переходим к созданию правила распределения', async () => {
      await licenseRulesPage.createRuleBtn.click();
    });
    await test.step('Заполняем форму группы', async () => {
      await licenseRulesPage.newRulePage.nameField.input.fill(data.license_rule_uno);
      await licenseRulesPage.newRulePage.descriptionField.textarea.fill(data.license_rule_uno.description);
      
    });
    // await test.step('Создаём группу', async () => {
    //   await groupsPage.newGroupPage.createBtn.click();
    //   groupCreationDate = dayjs(); // Временем создания является время отправки запроса
    //   await expect(groupsPage.newGroupPage.actionAlert).toBeInViewport({ timeout: 30000 });
    //   await page.waitForLoadState('load');
    //   await expect(groupsPage.table.head).toBeVisible();
    // });
    // await test.step('Ищем созданную группу', async () => {
    //   await expect(commonPage.contentLoader).toBeHidden();
    //   await commonPage.searchField.openBtn.click();
    //   await commonPage.searchField.input.fill(data.group_uno.name);
    //   await expect(commonPage.contentLoader).toBeHidden();

    //   await expect(groupsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    // });
    // await test.step('Проверяем созданного пользователя', async () => {
    //   const groupRow = groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
    //   // Название
    //   await expect(groupRow.nth(0)).toHaveText(data.group_uno.name);
    //   // Описание
    //   await expect(groupRow.nth(1)).toHaveText(data.group_uno.description);
    //   // Тип
    //   await expect(groupRow.nth(2)).toHaveText('Локальная группа');
    //   // Источник
    //   await expect(groupRow.nth(3)).toBeEmpty();
    //   // Элементы управления
    //   await expect(groupRow.locator('button').nth(0)).toBeVisible();
    //   await expect(groupRow.locator('button').nth(1)).toBeVisible();

    //   // Вытягиваем ID созданной группы из ссылки
    //   await groupRow.locator('button').nth(0).click();
    //   groupId = page.url().split('/edit/')[1];
    // });

    // await test.step('Проверяем логи в журнале событий', async () => {
    //   await test.step('Переходим в "События информационной безопасности"', async () => {
    //     await commonPage.adminLinksMenu.logsLink.click();
    //     await page.waitForLoadState('load');

    //     await logsPage.tabs.informationSecurityLogs.click();
    //     await expect(commonPage.contentLoader).toBeHidden();
    //   });
    //   await test.step('Ищем событие создания пользователя', async () => {
    //     await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
    //     await page.getByRole('menuitem', { name: 'Group created (local)' }).click();
    //     // TODO: не работает поиск по объекту операции, ищем по адресу объекта
    //     await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
    //     await page
    //       .locator('input[data-testid*=table-search-input]')
    //       .last()
    //       .fill(groupId + '');
    //     await page.keyboard.press('Enter');
    //     await page.waitForTimeout(2000);
    //     await expect(commonPage.contentLoader).toBeHidden();

    //     await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    //   });
    //   await test.step('Проверяем лог создания пользователя', async () => {
    //     const logRow = logsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
    //     // Событие
    //     await expect(logRow.nth(0)).toHaveText('GroupCreated');
    //     // Время
    //     expect(
    //       Math.abs(groupCreationDate.diff(dayjs(await logRow.nth(1).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'second'))
    //     ).toBeLessThanOrEqual(1);
    //     // Параметры
    //     await expect(logRow.nth(2)).toBeEmpty();
    //     // Адрес пользователя
    //     expect(await logRow.nth(3).textContent()).toMatch(helper.regexMasks.ipv4);
    //     // Имя сервера
    //     await expect(logRow.nth(4)).not.toBeEmpty();
    //     // Уровень важности
    //     await expect(logRow.nth(5)).toHaveText('Info');
    //     // Сообщение
    //     await expect(logRow.nth(6)).toHaveText('User group was created');
    //     // Раздел
    //     await expect(logRow.nth(7)).toHaveText('UserGroup');
    //     // Oбъект операции
    //     await expect(logRow.nth(8)).toHaveText(`Группа пользователей: ${data.group_uno.name}`);
    //     await expect(logRow.nth(8).locator('ul li a[href*="/admin/groups/edit/"]')).toHaveText(data.group_uno.name);
    //     // Адрес объекта операции
    //     await expect(logRow.nth(9)).toHaveText(groupId + '');
    //     // Субъект операции
    //     await expect(logRow.nth(10).locator('a[href*="/admin/users/edit/"]')).toHaveText(getMainUser().username);
    //     // Адрес субъекта операции
    //     expect(await logRow.nth(11).textContent()).toMatch(helper.regexMasks.guid);
    //     // Результат операции
    //     await expect(logRow.nth(12)).toHaveText('Success');
    //   });
    // });
  });
});
