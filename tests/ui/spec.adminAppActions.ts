import { Application } from '../../data/data';
import ApplicationTD from '../../data/data.application';
import { rewriteData, writeData } from '../../data/data.common';
import { EventLogInfo } from '../../pages/adminPages/page.logs';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe.serial('Действия с приложениями в подразделе "Приложения"', async () => {
  test.beforeEach(async ({ loginPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
  });

  /* Create: 10.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?folderId=2653&selected=12927

  1. Открыть подраздел “Приложения”
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
  7. Перейти в подраздел “Журнал событий”
  – Открыт “Журнал событий”
  8. Проверить событие “Update” для типа объекта “Приложение”
  – В новой записи, вколонке “Объект операции” указана измененное приложение
  – В колонке “Имя пользователя” указан пользователь, под которым выполняется проверка
  9. Проверить ссылки на ресурсы в полях “Объект операции” и “Пользователь”
  – Ссылки кликабельны
  Ссылки ведут на корректные ресурсы */

  test('2.1.9. Редактирование приложения через раздел "Администрирование"', async ({
    page,
    commonPage,
    directoryPage,
    applicationsPage,
    logsPage,
  }) => {
    let oldApplication: Application = await ApplicationTD.createApplication();
    let newApplication: Application = await ApplicationTD.createApplication();
    let appCreationDate: Dayjs;
    let appModificationDate: Dayjs;

    await test.step('Переходим в подраздел "Приложения"', async () => {
      await commonPage.sideMenu.dirsBtn.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Переходим к созданию приложения', async () => {
      await directoryPage.addAppBtn.click();
    });
    await test.step('Заполняем форму приложения', async () => {
      await expect(directoryPage.appModal.modalTitle).toHaveText('Новое приложение');
      await directoryPage.appModal.nameField.input.fill(oldApplication.name);
      await directoryPage.appModal.descriptionField.input.fill(`${oldApplication.description}`);
      await expect(directoryPage.appModal.previewUpload).toBeVisible();
    });
    await test.step('Создаём приложение', async () => {
      await directoryPage.appModal.createBtn.click();
      appCreationDate = dayjs(); // Временем создания является время отправки запроса
      await page.waitForLoadState('load');
      await expect(directoryPage.appModal.modalTitle).toBeHidden({ timeout: 20000 });
    });
    await test.step('Переходим в подраздел администрирования "Приложения"', async () => {
      await commonPage.sideMenu.adminBtn.click();
      await commonPage.adminLinksMenu.applicationsLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Ищем созданное приложение', async () => {
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(oldApplication.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(applicationsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданное приложение', async () => {
      const appRow = applicationsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(appRow.nth(1)).toHaveText(oldApplication.name);
      // Описание
      await expect(appRow.nth(2)).toHaveText(`${oldApplication.description}`);
      // Директория
      await expect(appRow.nth(3)).toHaveText(`${getMainUser().username} (Персональная)`);
      // Автор
      await expect(appRow.nth(4)).toHaveText(getMainUser().username);
      // Опубликовано
      await expect(appRow.nth(5)).toBeEmpty();
      // Создано
      await expect(appRow.nth(6)).toHaveText(appCreationDate.format('DD.MM.YYYY'));
      // Изменено
      await expect(appRow.nth(7)).toBeEmpty();
      // Элементы управления
      await expect(appRow.locator('button').nth(0)).toBeVisible();
      await expect(appRow.locator('button').nth(1)).toBeVisible();
    });
    await test.step('Переходим к редактированию приложения', async () => {
      await applicationsPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(0)
        .click();
      // Записываем директорию для дальнейших тестов
      oldApplication.id = page.url().split('/applications/')[1];
      oldApplication.metadata = { created_at: appCreationDate.format('DD.MM.YYYY HH:mm:ss') };
      writeData('application_admin_crud', oldApplication);
    });
    await test.step('Заполняем форму приложения', async () => {
      await expect(applicationsPage.appPage.pageTitle).toHaveText(`Редактирование приложения ${oldApplication.name}`);
      await applicationsPage.appPage.nameField.input.fill(newApplication.name);
      await applicationsPage.appPage.descriptionField.input.fill(`${newApplication.description}`);

      await expect(page.locator('form :below(.ant-form-item).ant-space article').nth(0)).toHaveText(
        `Автор: ${getMainUser().username}`
      );
      await expect(page.locator('form :below(.ant-form-item).ant-space article').nth(1)).toContainText(
        `Дата создания: ${appCreationDate.format('DD.MM.YYYY HH:mm')}`
      );
    });
    await test.step('Сохраняем изменения приложения', async () => {
      await applicationsPage.appPage.saveBtn.click();
      appModificationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(applicationsPage.appPage.actionAlert).toHaveText('Приложение успешно обновлено', {
        timeout: 5000,
      });
      await page.waitForLoadState('load');
      await expect(directoryPage.appModal.modalTitle).toBeHidden({ timeout: 10000 });
    });
    await test.step('Ищем изменённое приложение', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.input.fill(newApplication.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(applicationsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем изменённое приложение', async () => {
      const appRow = applicationsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(appRow.nth(1)).toHaveText(newApplication.name);
      // Описание
      await expect(appRow.nth(2)).toHaveText(`${newApplication.description}`);
      // Директория
      await expect(appRow.nth(3)).toHaveText(`${getMainUser().username} (Персональная)`);
      // Автор
      await expect(appRow.nth(4)).toHaveText(getMainUser().username);
      // Опубликовано
      await expect(appRow.nth(5)).toBeEmpty();
      // Создано
      await expect(appRow.nth(6)).toHaveText(appCreationDate.format('DD.MM.YYYY'));
      // Изменено
      await expect(appRow.nth(7)).toHaveText(appModificationDate.format('DD.MM.YYYY'));
      // Элементы управления
      await expect(appRow.locator('button').nth(0)).toBeVisible();
      await expect(appRow.locator('button').nth(1)).toBeVisible();

      // Записываем приложение для дальнейших тестов
      newApplication.id = oldApplication.id;
      newApplication.metadata = oldApplication.metadata;
      newApplication.metadata.modified_at = appModificationDate.format('DD.MM.YYYY HH:mm:ss');
      rewriteData('application_admin_crud', newApplication);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие изменения приложения', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Update' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${newApplication.name}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог изменения приложения', async () => {
        const createDirLogInfo: EventLogInfo = {
          event: 'Update',
          time: appModificationDate,
          operObjectType: 'Приложение',
          operObjectlink: `/application/${newApplication.id}`,
          operObjectName: newApplication.name,
          operObjectAddress: `${newApplication.id}`,
          message: 'Application was edited',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });

  /* Create: 10.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?folderId=2653&selected=12932

  1. Открыть подраздел “Приложения”
  2. Проскроллить список вправо (ctrl + скролл вниз)
  – Список проскроллен
  3. Нажать на иконку корзины в строке с произвольным ресурсом
  – Отрыто модельное окно
  4. Нажать “Точно удалить”
  – Ресурс удален и более не отображается в списке */

  test('2.1.14. Удаление приложения через раздел "Администрирование"', async ({
    page,
    commonPage,
    applicationsPage,
    logsPage,
    data,
  }) => {
    const application: Application = data.application_admin_crud;
    let appDeletionDate: Dayjs;

    await test.step('Переходим в раздел "Администрирование"', async () => {
      await commonPage.sideMenu.adminBtn.click();
    });
    await test.step('Переходим в подраздел "Приложения"', async () => {
      await commonPage.adminLinksMenu.applicationsLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Ищем созданное приложение', async () => {
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(application.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(applicationsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Удаляем приложение', async () => {
      await expect(applicationsPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').nth(1)).toHaveText(
        application.name
      );
      await applicationsPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(1)
        .click();

      await test.step('Проверяем модальное окно удаления приложения', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          'Удаление приложения'
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body div').nth(0)).toHaveText(
          `Приложение "${application.name}" будет удалено`
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-alert-message')).toHaveText(
          'Это действие нельзя отменить.'
        );
      });

      await commonPage.deleteModal.applyBtn.click();
      appDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем отсутствие приложения', async () => {
      await expect(applicationsPage.table.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие удаления приложения', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${application.name}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог удаления приложения', async () => {
        const createDirLogInfo: EventLogInfo = {
          event: 'Delete',
          time: appDeletionDate,
          operObjectType: 'Приложение',
          operObjectlink: `/application/${application.id}`,
          operObjectName: application.name,
          operObjectAddress: `${application.id}`,
          message: 'Application was deleted',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });
});
