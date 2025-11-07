import { User } from '../../data/data';
import { rewriteData } from '../../data/data.common';
import { SecurityLogInfo } from '../../pages/adminPages/page.logs';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
import Helper from '../../utils/helper';
import UsersTD from '../../data/data.users';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe('Действия с пользователями', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
    await test.step('Переходим в раздел "Администрирование"', async () => {
      await commonPage.sideMenu.adminBtn.click();
    });
    await test.step('Переходим в подраздел "Пользователи"', async () => {
      await commonPage.adminLinksMenu.usersLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
  });

  /* Create: 16.09.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13070

  1. Открыть подраздел “Пользователи”
  - Подаздел открыт
  2. Нажать “Добавить пользователя”
  - Открыта страница “Создать пользователя”
  3. Заполнить поле "Имя пользователя"
  - Поле заполнено
  4. Заполнить поле “Пароль”
  - Поле заполнено
  5. Заполнить поле “Подтверждение пароля”
  - Поле заполнено
  6. Нажать "Создать"
  - Отображается уведомление об успешном добавлении пользователя: Открыт подраздел “Пользователи”; Пользователь создан и отображается в списке.
  7. Перейти в подраздел “Журнал событий”
  - Открыт “Журнал событий”
  8. Перейти на вкладку “События Информационной Безопасности”
  - Отображаются “События Информационной Безопасности”
  9. Проверить запись "User created"
  - Присутствует запись о создании пользователя; В колонке “Объект операции” указан созданный ранее пользователь; В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  10. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  - Ссылки кликабельны; Ссылки ведут на корректные ресурсы
  11. Проверить поле “Параметры”
  - В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.1.1. Создание пользователя', async ({ page, commonPage, usersPage, logsPage, helper, data }) => {
    const user: User = data.user_uno;
    let userCreationDate: Dayjs;

    await test.step('Переходим к созданию пользователя', async () => {
      await usersPage.createUserBtn.click();
    });
    await test.step('Заполняем форму пользователя', async () => {
      await usersPage.newUserPage.usernameField.input.fill(user.username);
      await usersPage.newUserPage.displayedNameField.input.fill(`${user.displayed_name}`);
      await usersPage.newUserPage.emailField.input.fill(`${user.email}`);
      await usersPage.newUserPage.passField.input.fill(user.password);
      await usersPage.newUserPage.repeatPassField.input.fill(user.password);
      if (!user.active) {
        await usersPage.newUserPage.isActiveCheckbox.checkbox.click();
      }
      if (user.first_login_reset_password) {
        await usersPage.newUserPage.firstLoginResetPassCheckbox.checkbox.click();
      }
    });
    await test.step('Создаём пользователя', async () => {
      await usersPage.newUserPage.createBtn.click();
      userCreationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(usersPage.newUserPage.actionAlert).toHaveText('Вы успешно создали пользователя!', {
        timeout: 30000,
      });
      await page.waitForLoadState('load');
      await expect(usersPage.table.head).toBeVisible();
    });
    await test.step('Ищем созданного пользователя', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(user.username);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданного пользователя', async () => {
      const userRow = usersPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Имя
      await expect(userRow.nth(1)).toHaveText(user.username);
      // Отображаемое имя
      await expect(userRow.nth(2)).toHaveText(`${user.displayed_name}`);
      // E-mail
      await expect(userRow.nth(3)).toHaveText(`${user.email}`);
      // Импорт из AD
      await expect(userRow.nth(4)).toHaveText('Нет');
      // Группы
      await expect(userRow.nth(5)).toBeEmpty();
      // Группа AD
      await expect(userRow.nth(6)).toBeEmpty();
      // Тип лицензии
      await expect(userRow.nth(7)).toBeEmpty();
      // Деактивирован
      await expect(userRow.nth(8)).toHaveText(user.active ? 'Нет' : 'Да');
      // Дата создания (иногда округляется в меньшую сторону на секунду)
      expect(
        Math.abs(userCreationDate.diff(dayjs(await userRow.nth(9).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'second'))
      ).toBeLessThanOrEqual(1);
      user.metadata = { created_at: (await userRow.nth(9).textContent()) + '' };
      // Дата изменения
      await expect(userRow.nth(10)).toBeEmpty();
      // Дата последнего входа
      await expect(userRow.nth(11)).toBeEmpty();
      // Кем изменён
      await expect(userRow.nth(12)).toBeEmpty();
      // Внутренний ID (запоминаем для логов)
      user.id = (await userRow.nth(13).textContent()) || '';
      expect(user.id).toMatch(helper.regexMasks.guid);
      // AD ID
      await expect(userRow.nth(14)).toBeEmpty();
      // Источник пользователя
      await expect(userRow.nth(15)).toBeEmpty();
      // Элементы управления
      await expect(userRow.last().locator('button[data-testid*=users-page-table-item-edit]')).toBeVisible();
      await expect(userRow.last().locator('button[data-testid*=users-page-table-item-delete]')).toBeVisible();

      // Записываем пользователя для дальнейших тестов
      rewriteData('user_uno', user);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие создания пользователя', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'User created' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${user.id}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог создания пользователя', async () => {
        const userDeleteLogInfo: SecurityLogInfo = {
          event: 'UserCreated',
          time: userCreationDate,
          options: [
            'Имя параметра: UserName',
            `Значение: ${user.username}`,
            'Имя параметра: Email',
            `Значение: ${user.email}`,
            'Имя параметра: Groups',
            'Значение: (пусто)',
            'Имя параметра: ForceChangeOnLogin',
            `Значение: ${Helper.capitalize(user.first_login_reset_password + '')}`,
            'Имя параметра: Inactive',
            `Значение: ${Helper.capitalize(!user.active + '')}`,
          ],
          importanceLevel: 'Info',
          message: 'User was created',
          section: 'User',
          operObjectType: 'Пользователь',
          operObjectlink: `/admin/users/edit/${user.id}`,
          operObjectName: user.username,
          operObjectAddress: `${user.id}`,
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });

  /* Create: 05.11.2025
    https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13072

    1. Открыть подраздел “Пользователи”
    – Подраздел открыт
    2. Проскроллить список вправо (ctrl+скролл вниз)
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
    10. Проверить запись "User edited"
    – Запись присутствует в журнале
    – В новой записи, в колонке “Объект операции” указан отредактированный пользователь
    – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка */

  test('6.1.2. Редактирование пользователя', async ({ page, commonPage, usersPage, logsPage, data, helper }) => {
    const oldUser: User = data.user_uno;
    const newUser = await UsersTD.createUser();
    let userModificationDate: Dayjs;

    await test.step('Ищем подходящего пользователя', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(oldUser.username);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Переходим к изменению пользователя', async () => {
      await usersPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').locator('button').nth(0).click();
    });
    await test.step('Заполняем форму пользователя', async () => {
      await usersPage.editUserPage.usernameField.input.fill(newUser.username);
      await usersPage.editUserPage.displayedNameField.input.fill(`${newUser.displayed_name}`);
      await usersPage.editUserPage.emailField.input.fill(`${newUser.email}`);

      const aChecked = await usersPage.editUserPage.isActiveCheckbox.checkbox.isChecked();
      if ((!aChecked && newUser.active) || (aChecked && !newUser.active)) {
        await usersPage.editUserPage.isActiveCheckbox.checkbox.click();
      }

      await expect(usersPage.editUserPage.isADCheckbox.checkbox).toBeDisabled();
      await expect(usersPage.editUserPage.adGroupField.input).toBeDisabled();
      await expect(usersPage.editUserPage.adUserIDField.input).toBeDisabled();
      await expect(usersPage.editUserPage.creationDateField.input).toBeDisabled();
      await expect(usersPage.editUserPage.modificationDateField.input).toBeDisabled();
      await expect(usersPage.editUserPage.updatedByField.input).toBeDisabled();
      await expect(usersPage.editUserPage.licenseTypeField.input).toBeDisabled();
    });
    await test.step('Сохраняем изменения пользователя', async () => {
      await usersPage.editUserPage.saveBtn.click();
      userModificationDate = dayjs(); // Временем изменения является время отправки запроса
      await expect(usersPage.editUserPage.actionAlert).toHaveText('Вы успешно сохранили пользователя!', {
        timeout: 30000,
      });
      await page.waitForLoadState('load');
      await expect(usersPage.table.head).toBeVisible();
    });
    await test.step('Ищем изменённого пользователя', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.input.clear();
      await commonPage.searchField.input.fill(newUser.username);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем изменённого пользователя', async () => {
      const userRow = usersPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Имя
      await expect(userRow.nth(1)).toHaveText(newUser.username);
      // Отображаемое имя
      await expect(userRow.nth(2)).toHaveText(`${newUser.displayed_name}`);
      // E-mail
      await expect(userRow.nth(3)).toHaveText(`${newUser.email}`);
      // Импорт из AD
      await expect(userRow.nth(4)).toHaveText('Нет');
      // Группы
      await expect(userRow.nth(5)).toBeEmpty();
      // Группа AD
      await expect(userRow.nth(6)).toBeEmpty();
      // Тип лицензии
      await expect(userRow.nth(7)).toBeEmpty();
      // Деактивирован
      await expect(userRow.nth(8)).toHaveText(newUser.active ? 'Нет' : 'Да');
      // Дата создания
      await expect(userRow.nth(9)).toHaveText(`${oldUser.metadata?.created_at}`);
      // Дата изменения
      expect(
        Math.abs(userModificationDate.diff(dayjs(await userRow.nth(10).textContent(), 'DD.MM.YYYY HH:mm:ss'), 'second'))
      ).toBeLessThanOrEqual(1);
      // Дата последнего входа
      await expect(userRow.nth(11)).toBeEmpty();
      // Кем изменён
      await expect(userRow.nth(12)).toHaveText(getMainUser().username);
      // Внутренний ID
      newUser.id = (await userRow.nth(13).textContent()) || '';
      expect(oldUser.id === newUser.id).toBeTruthy();
      expect(newUser.id).toMatch(helper.regexMasks.guid);
      // AD ID
      await expect(userRow.nth(14)).toBeEmpty();
      // Источник пользователя
      await expect(userRow.nth(15)).toBeEmpty();
      // Элементы управления
      await expect(userRow.last().locator('button[data-testid*=users-page-table-item-edit]')).toBeVisible();
      await expect(userRow.last().locator('button[data-testid*=users-page-table-item-delete]')).toBeVisible();

      // Перезаписываем пользователя для дальнейших тестов
      rewriteData('user_uno', newUser);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');
        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие изменения пользователя', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'User edited (local)' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${oldUser.id}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог изменения пользователя', async () => {
        const updOptions = function (newU: User, oldU: User) {
          let options = [];

          if (newU.email !== oldU.email) {
            options.push('Имя параметра: Email', `Старое значение: ${oldU.email}`, `Новое значение: ${newU.email}`);
          }
          if (newU.username !== oldU.username) {
            options.push(
              'Имя параметра: UserName',
              `Старое значение: ${oldU.username}`,
              `Новое значение: ${newU.username}`
            );
          }
          if (newU.active !== oldU.active) {
            options.push(
              'Имя параметра: Inactive',
              `Старое значение: ${Helper.capitalize(oldU.active + '')}`,
              `Новое значение: ${Helper.capitalize(newU.active + '')}`
            );
          }
          if (newU.displayed_name !== oldU.displayed_name) {
            options.push(
              'Имя параметра: DisplayName',
              `Старое значение: ${oldU.displayed_name}`,
              `Новое значение: ${newU.displayed_name}`
            );
          }
          return options;
        };
        const userDeleteLogInfo: SecurityLogInfo = {
          event: 'UserEdited',
          time: userModificationDate,
          options: updOptions(newUser, oldUser),
          importanceLevel: 'Info',
          message: 'User was edited',
          section: 'User',
          operObjectType: 'Пользователь',
          operObjectlink: `/admin/users/edit/${oldUser.id}`,
          operObjectName: newUser.username,
          operObjectAddress: `${oldUser.id}`,
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });

  /* Create: 16.09.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13073

  1. Открыть подраздел “Пользователи”
  - Подаздел открыт
  2. Проскроллить список вправо
  - Список проскроллен
  3. Нажать на иконку корзины в строке с произвольным ресурсом
  - Отрыто модельное окно с сообщением “Вы уверены что хотите удалить [тип ресурса]?”
  4. Нажать “Удалить”
  - Ресурс удален и более не отображается в списке
  5. Открыть раздел “Администрирование”
  6. Перейти в подраздел “Журнал событий”
  - Открыт “Журнал событий”
  7. Перейти на вкладку “События Информационной Безопасности”
  - Отображаются “События Информационной Безопасности”
  8. Проверить запись "User deleted"
  - В новой записи, в колонке “Объект операции” указан удалённый ранее юзер; В колонке “Субъект операции” указан пользователь, под которым выполняется проверка
  9. Проверить ссылки на ресурсы в полях “Объект операции” и “Субьект операции”
  - Ссылки кликабельны; Ссылки ведут на корректные ресурсы
  10. Проверить поле “Параметры”
  - В поле указаны корректные параметры созданного/отредактированного ресурса */

  test('6.1.3. Удаление пользователя', async ({ page, commonPage, usersPage, logsPage, data }) => {
    const user: User = data.user_uno;
    let userDeletionDate: Dayjs;

    await test.step('Ищем созданного пользователя', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(user.username);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Удаляем пользователя', async () => {
      await expect(usersPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').nth(1)).toHaveText(
        user.username
      );
      await page.locator('tr.ant-table-row').nth(0).locator('td').last().locator('[data-testid*=delete]').click();

      await test.step('Проверяем модальное окно удаления пользователя', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          'Вы уверены что хотите удалить данного пользователя?'
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-typography div')).toHaveText([
          'Внимание! Удаление приведёт к удалению всех Приложений и Дашбордов в его Персональной Директории!',
          'Это действие нельзя отменить.',
        ]);
      });

      await commonPage.deleteModal.applyBtn.click();
      userDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Проверяем отсутствие пользователя', async () => {
      await expect(usersPage.table.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События информационной безопасности"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await logsPage.tabs.informationSecurityLogs.click();
        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие удаления пользователя', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'User deleted (local)' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
        // Не работает поиск по объекту операции, ищем по адресу объекта
        await logsPage.table.head.locator('th.ant-table-cell').nth(9).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${user.id}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог удаления пользователя', async () => {
        const userDeleteLogInfo: SecurityLogInfo = {
          event: 'UserDeleted',
          time: userDeletionDate,
          options: [],
          importanceLevel: 'Info',
          message: 'User was deleted',
          section: 'User',
          operObjectType: 'Пользователь',
          operObjectlink: `/admin/users/edit/${user.id}`,
          operObjectName: user.username,
          operObjectAddress: `${user.id}`,
        };
        await logsPage.checkSecurityLogs(0, userDeleteLogInfo);
      });
    });
  });
});
