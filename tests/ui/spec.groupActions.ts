import { Group } from '../../data/data';
import { rewriteData } from '../../data/data.common';
import GroupsTD from '../../data/data.groups';
import { LogInfo } from '../../pages/adminPages/page.logs';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe('Действия с группами', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
    await test.step('Переходим в раздел "Администрирование"', async () => {
      await commonPage.sideMenu.adminBtn.click();
    });
    await test.step('Переходим в подраздел "Группы"', async () => {
      await commonPage.adminLinksMenu.groupsLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
  });

  /* Create: 17.09.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13075

  1. Открыть подраздел “Группы”
  – Подраздел открыт
  2. Нажать “Добавить группу”
  – Открыта страница создания группы
  3. Заполнить поле “Название”
  – Поле заполнено
  4. Нажать "Создать"
  – Отображается уведомление о создании группы; Открыт подраздел “Группы”; Группа создана и отображается в списке групп
  5. Перейти в подраздел “Журнал событий”
  – Открыт “Журнал событий”
  6. Перейти на вкладку “События Информационной Безопасности”
  – Отображаются “События Информационной Безопасности”
  7. Проверить запись "Group created"
  – Присутствует запись о создании группы; В колонке “Объект операции” указана созданная группа; В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  8. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  – Ссылки кликабельны; Ссылки ведут на корректные ресурсы
  9. Проверить поле “Параметры”
  – В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.1.4. Создание группы', async ({ page, commonPage, groupsPage, logsPage, data }) => {
    let group: Group = data.group_uno;
    let groupCreationDate: Dayjs;

    await test.step('Переходим к созданию группы', async () => {
      await groupsPage.createGroupBtn.click();
    });
    await test.step('Заполняем форму группы', async () => {
      await groupsPage.groupPage.nameField.input.fill(group.name);
      await groupsPage.groupPage.descriptionField.input.fill(`${group.description}`);
    });
    await test.step('Создаём группу', async () => {
      await groupsPage.groupPage.createBtn.click();
      groupCreationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(groupsPage.groupPage.actionAlert).toBeInViewport({ timeout: 30000 });
      await page.waitForLoadState('load');
      await expect(groupsPage.table.head).toBeVisible();
    });
    await test.step('Ищем созданную группу', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(group.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(groupsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданную группу', async () => {
      const groupRow = groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(groupRow.nth(0)).toHaveText(group.name);
      // Описание
      await expect(groupRow.nth(1)).toHaveText(`${group.description}`);
      // Тип
      await expect(groupRow.nth(2)).toHaveText('Локальная группа');
      // Источник
      await expect(groupRow.nth(3)).toBeEmpty();
      // Элементы управления
      await expect(groupRow.locator('button').nth(0)).toBeVisible();
      await expect(groupRow.locator('button').nth(1)).toBeVisible();

      // Вытягиваем ID созданной группы из ссылки
      await groupRow.locator('button').nth(0).click();
      group.id = page.url().split('/edit/')[1];
      // Записываем id группы для дальнейших тестов
      rewriteData('group_uno', group);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие создания группы', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Group created (local)' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${group.id}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог создания группы', async () => {
        const userDeleteLogInfo: LogInfo = {
          event: 'GroupCreated',
          time: groupCreationDate,
          options: [],
          importanceLevel: 'Info',
          message: 'User group was created',
          section: 'UserGroup',
          operObjectType: 'Группа пользователей',
          operObjectlink: `/admin/groups/edit/${group.id}`,
          operObjectName: group.name,
          operObjectAddress: `${group.id}`,
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });

  /* Create: 05.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13074

  1. Открыть подраздел “Группы”
  – Подраздел открыт
  2. Проскроллить список вправо (ctrl + скролл вниз)
  – Список проскроллен
  3. Нажать на иконку карандаша в строке с произвольным ресурсом
  – Открыло окно редактирования ресурса
  4. Изменить произвольные параметры в окне редактирования
  – Параметры изменены
  5. Нажать “Сохранить”
  – Отображается список проверяемых ресурсов
  6. Проверить, что внесенные изменения отображаются в списке ресурсов
  – Изменения отображаются для отредактированного ресурса
  7. Открыть раздел “Администрирование”
  8. Перейти в подраздел “Журнал событий”
  – Открыт “Журнал событий”
  9. Перейти на вкладку “События Информационной Безопасности”
  – Отображаются “События Информационной Безопасности”
  10. Проверить запись "Group edited"
  – В новой записи, в колонке “Объект операции” указана измененная группа
  – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  11. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  – Ссылки кликабельны
  – Ссылки ведут на корректные ресурсы
  12. Проверить поле “Параметры”
  – В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.1.5. Редактирование группы', async ({ page, commonPage, groupsPage, logsPage, data }) => {
    const oldGroup = data.group_uno;
    const newGroup = await GroupsTD.createGroup();
    let groupUpdationDate: Dayjs;

    await test.step('Ищем подходящую группу', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(oldGroup.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(groupsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Переходим к редактированию группы', async () => {
      await groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').locator('button').nth(0).click();
    });
    await test.step('Заполняем форму группы', async () => {
      await groupsPage.groupPage.nameField.input.clear();
      await groupsPage.groupPage.nameField.input.fill(newGroup.name);
      await groupsPage.groupPage.descriptionField.input.clear();
      await groupsPage.groupPage.descriptionField.input.fill(newGroup.description || 'Description undefined');
    });
    await test.step('Сохраняем изменения группы', async () => {
      await groupsPage.groupPage.createBtn.click();
      groupUpdationDate = dayjs(); // Временем изменения является время отправки запроса
      await expect(groupsPage.groupPage.actionAlert).toBeInViewport({ timeout: 30000 });
      await page.waitForLoadState('load');
      await expect(groupsPage.table.head).toBeVisible();
    });
    await test.step('Ищем изменённую группу', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.input.clear();
      await commonPage.searchField.input.fill(newGroup.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(groupsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      // Записываем изменённую группу
      newGroup.id = oldGroup.id;
      rewriteData('group_uno', newGroup);
    });
    await test.step('Проверяем изменённую группу', async () => {
      const groupRow = groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(groupRow.nth(0)).toHaveText(newGroup.name);
      // Описание
      await expect(groupRow.nth(1)).toHaveText(newGroup.description || 'Description undefined');
      // Тип
      await expect(groupRow.nth(2)).toHaveText('Локальная группа');
      // Источник
      await expect(groupRow.nth(3)).toBeEmpty();
      // Элементы управления
      await expect(groupRow.locator('button').nth(0)).toBeVisible();
      await expect(groupRow.locator('button').nth(1)).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие изменения группы', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Group edited (local)' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${oldGroup.id}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог изменения группы', async () => {
        const updOptions = function (newG: Group, oldG: Group) {
          let options = [];
          if (newG.name !== oldG.name) {
            options.push('Имя параметра: Name', `Старое значение: ${oldG.name}`, `Новое значение: ${newG.name}`);
          }
          if (newG.description !== oldG.description) {
            options.push(
              'Имя параметра: Description',
              `Старое значение: ${oldG.description}`,
              `Новое значение: ${newG.description}`
            );
          }
          return options;
        };

        const userDeleteLogInfo: LogInfo = {
          event: 'GroupEdited',
          time: groupUpdationDate,
          options: updOptions(newGroup, oldGroup),
          importanceLevel: 'Info',
          message: 'User group was updated',
          section: 'UserGroup',
          operObjectType: 'Группа пользователей',
          operObjectlink: `/admin/groups/edit/${oldGroup.id}`,
          operObjectName: newGroup.name,
          operObjectAddress: `${oldGroup.id}`,
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });

  /* Create: 17.09.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13076

  1. Открыть подраздел “Группы”
  - Подраздел открыт
  2. Проскроллить список вправо (ctrl+скролл вниз)
  - Список проскроллен
  3. Нажать на иконку корзины в строке с произвольным ресурсом
  - Отрыто модельное окно с сообщением “Вы уверены что хотите удалить [тип ресурса]?”
  4. Нажать “Удалить”
  - Ресурс удален и более не отображается в списке
  5. Окрыть раздел “Администрирование”
  6. Перейти в подраздел “Журнал событий”
  - Отображается журнал событий
  7. Перейти на вкладку “События Информационной Безопасности”
  - Отображаются “События Информационной Безопасности”
  8. Проверить запись "Group deleted"
  - В новой записи, в колонке “Объект операции” указана удаленная группа; В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  9. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  - Ссылки кликабельны; Ссылки ведут на корректные ресурсы
  10. Проверить поле “Параметры”
  - В поле указаны корректные параметры созданного/отредактированного ресурса
  */

  test('6.1.6. Удаление группы', async ({ page, commonPage, groupsPage, logsPage, data }) => {
    const group: Group = data.group_uno;
    let groupDeletionDate: Dayjs;

    await test.step('Ищем созданную группу', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(group.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(groupsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      // Вытягиваем ID созданной группы из ссылки
      await groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').locator('button').nth(0).click();
      group.id = page.url().split('/edit/')[1];
      await commonPage.adminLinksMenu.groupsLink.click();
    });
    await test.step('Удаляем группу', async () => {
      await expect(groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').nth(0)).toHaveText(
        group.name
      );
      await groupsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').locator('button').nth(1).click();

      await test.step('Проверяем модальное окно удаления группы', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          `Вы уверены что хотите удалить группу "${group.name}"?`
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-typography')).toHaveText(
          'Это действие нельзя отменить.'
        );
      });

      await commonPage.deleteModal.applyBtn.click();
      groupDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем отсутствие группы', async () => {
      await expect(groupsPage.table.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие удаления группы', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Group deleted (local)' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page
          .locator('input[data-testid*=table-search-input]')
          .last()
          .fill(group.id + '');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог удаления группы', async () => {
        const userDeleteLogInfo: LogInfo = {
          event: 'GroupDeleted',
          time: groupDeletionDate,
          options: ['Имя параметра: Name', `Значение: ${group.name}`],
          importanceLevel: 'Info',
          message: '',
          section: 'UserGroup',
          operObjectType: 'Группа пользователей',
          operObjectlink: `/admin/groups/edit/${group.id}`,
          operObjectName: group.name,
          operObjectAddress: `${group.id}`,
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });
});
