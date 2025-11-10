import { Directory } from '../../data/data';
import { rewriteData, writeData } from '../../data/data.common';
import { EventLogInfo } from '../../pages/adminPages/page.logs';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
import DirectoriesTD from '../../data/data.directory';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe.serial('Действия с директориями', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
    await test.step('Переходим в раздел "Администрирование"', async () => {
      await commonPage.sideMenu.adminBtn.click();
    });
    await test.step('Переходим в подраздел "Директории"', async () => {
      await commonPage.adminLinksMenu.directoriesLink.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
  });

  /* Create: 07.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=10217

  1. Открыть подраздел “Директории”
  2. Нажать “Новая директория”
  – Открыто окно “Создание директории”
  3. Заполнить поле “Название”
  4. Нажать "Сохранить"
  – Директория создана
  5. Открыть раздел “Директории”
  – Директория отображается в сайдбаре
  6. Открыть созданную директорию
  – Отображается пустая директория
  7. Открыть раздел “Администрирование”
  8. Перейти в подраздел “Журнал событий”
  – Открыт “Журнал событий”
  9. Проверить событие “Create” для типа объекта “Директория”
  – В новой записи, в колонке “Объект операции” указана созданная директория
  – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка */

  test('2.1.6. Создание директории', async ({ page, commonPage, directoriesPage, logsPage }) => {
    let directory: Directory = await DirectoriesTD.createDirectory();
    writeData('directory_crud', directory);
    let dirCreationDate: Dayjs;

    await test.step('Переходим к созданию директории', async () => {
      await directoriesPage.createDirBtn.click();
    });
    await test.step('Заполняем форму директории', async () => {
      await expect(directoriesPage.createDirModal.modalTitle).toHaveText('Создание директории');
      await directoriesPage.dirPage.nameField.input.fill(directory.name);
      await directoriesPage.dirPage.descriptionField.input.fill(`${directory.description}`);
    });
    await test.step('Создаём директорию', async () => {
      await directoriesPage.createDirModal.createBtn.click();
      dirCreationDate = dayjs(); // Временем создания является время отправки запроса
      await expect(directoriesPage.createDirModal.modalTitle).toBeHidden({ timeout: 15000 });
      await page.waitForLoadState('load');
    });
    await test.step('Ищем созданную директорию', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(directory.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(directoriesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем созданную директорию', async () => {
      const directoryRow = directoriesPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
      // Название
      await expect(directoryRow.nth(1)).toHaveText(directory.name);
      // Описание
      await expect(directoryRow.nth(2)).toHaveText(`${directory.description}`);
      // Автор
      await expect(directoryRow.nth(3)).toHaveText(getMainUser().username);
      // Количество приложений
      await expect(directoryRow.nth(4)).toHaveText('0');
      // Создана
      await expect(directoryRow.nth(5)).toHaveText(dirCreationDate.format('DD.MM.YYYY'));
      // Изменена
      await expect(directoryRow.nth(6)).toBeEmpty();
      // Элементы управления
      await expect(directoryRow.locator('button').nth(0)).toBeVisible();
      await expect(directoryRow.locator('button').nth(1)).toBeVisible();

      // Вытягиваем ID созданной директории из ссылки
      await directoryRow.locator('button').nth(0).click();
      directory.id = page.url().split('/directories/')[1];
      // Записываем директорию для дальнейших тестов
      directory.metadata = { created_at: dirCreationDate.format('DD.MM.YYYY HH:mm:ss') };
      rewriteData('directory_crud', directory);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие создания директории', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Create' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${directory.name}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог создания директории', async () => {
        const createDirLogInfo: EventLogInfo = {
          event: 'Create',
          time: dirCreationDate,
          operObjectType: 'Директория',
          operObjectlink: `/directory/${directory.id}`,
          operObjectName: directory.name,
          operObjectAddress: `${directory.id}`,
          message: 'Directory was created',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });

  /* Create: 07.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=12929

  1. Открыть подраздел “Директории”
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
  9. Проверить запись “Update” для типа “Директория”
  – В новой записи, в колонке “Объект операции” указана измененная директория
  – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка */

  test('2.1.7. Редактирование директории', async ({ page, commonPage, directoriesPage, logsPage, data }) => {
    const oldDirectory = data.directory_crud;
    const newDirectory = await DirectoriesTD.createDirectory();
    let dirModificationDate: Dayjs;

    await test.step('Ищем подходящую директорию', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(oldDirectory.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(directoriesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Переходим к редактированию директории', async () => {
      await directoriesPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(0)
        .click();
    });
    await test.step('Заполняем форму директории', async () => {
      await expect(directoriesPage.dirPage.pageTitle).toHaveText(`Редактирование директории ${oldDirectory.name}`);
      await directoriesPage.dirPage.nameField.input.clear();
      await directoriesPage.dirPage.nameField.input.fill(newDirectory.name);
      await directoriesPage.dirPage.descriptionField.input.clear();
      await directoriesPage.dirPage.descriptionField.input.fill(newDirectory.description || 'Description undefined');
    });
    await test.step('Сохраняем изменения директории', async () => {
      await directoriesPage.dirPage.saveBtn.click();
      dirModificationDate = dayjs(); // Временем изменения является время отправки запроса
      await expect(directoriesPage.dirPage.actionAlert).toHaveText('Вы успешно сохранили изменения!', {
        timeout: 30000,
      });
      await page.waitForLoadState('load');
      await expect(directoriesPage.table.head).toBeVisible();
    });
    await test.step('Ищем изменённую директорию', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.input.clear();
      await commonPage.searchField.input.fill(newDirectory.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(directoriesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Проверяем изменённую директорию', async () => {
      await test.step('Проверяем изменённую директорию', async () => {
        const directoryRow = directoriesPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
        // Название
        await expect(directoryRow.nth(1)).toHaveText(newDirectory.name);
        // Описание
        await expect(directoryRow.nth(2)).toHaveText(`${newDirectory.description}`);
        // Автор
        await expect(directoryRow.nth(3)).toHaveText(getMainUser().username);
        // Количество приложений
        await expect(directoryRow.nth(4)).toHaveText('0');
        // Создана
        await expect(directoryRow.nth(5)).toHaveText(
          dayjs(oldDirectory.metadata.created_at, 'DD.MM.YYYY HH:mm:ss').format('DD.MM.YYYY')
        );
        // Изменена
        await expect(directoryRow.nth(6)).toHaveText(dirModificationDate.format('DD.MM.YYYY'));
        // Элементы управления
        await expect(directoryRow.locator('button').nth(0)).toBeVisible();
        await expect(directoryRow.locator('button').nth(1)).toBeVisible();

        // Записываем изменённую директории для дальнейших тестов
        newDirectory.id = oldDirectory.id;
        rewriteData('directory_crud', newDirectory);
      });
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие изменения директории', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Update' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${newDirectory.name}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог удаления директории', async () => {
        const createDirLogInfo: EventLogInfo = {
          event: 'Update',
          time: dirModificationDate,
          operObjectType: 'Директория',
          operObjectlink: `/directory/${oldDirectory.id}`,
          operObjectName: newDirectory.name,
          operObjectAddress: `${oldDirectory.id}`,
          message: 'Directory was edited',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });

  /* Create: 07.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=12926

  1. Открыть подраздел “Директории”
  2. Проскроллить список вправо (ctrl+скролл вниз)
  – Список проскроллен
  3. Нажать на иконку корзины в строке с произвольным ресурсом
  – Отрыто модельное окно с сообщением “Вы уверены что хотите удалить [тип ресурса]?”
  4. Нажать “Удалить”
  – Ресурс удален и более не отображается в списке
  5. Открыть раздел “Администрирование”
  6. Перейти в подраздел “Журнал событий”
  – Открыт “Журнал событий”
  7. Проверить запись типа “Delete” для объекта “Директория”
  – В новой записи, в колонке “Объект операции” указана удалённая директория
  – В колонке “Субъект операции” указан пользователь, под которым выполняется проверка */

  test('2.1.8. Удаление директории', async ({ page, commonPage, directoriesPage, logsPage, data }) => {
    const directory: Directory = data.directory_crud;
    let dirDeletionDate: Dayjs;

    await test.step('Ищем созданную директорию', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(directory.name);
      await page.keyboard.press('Enter');
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(directoriesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    });
    await test.step('Удаляем директорию', async () => {
      await expect(directoriesPage.table.body.locator('tr.ant-table-row').nth(0).locator('td').nth(1)).toHaveText(
        directory.name
      );
      await directoriesPage.table.body
        .locator('tr.ant-table-row')
        .nth(0)
        .locator('td')
        .locator('button')
        .nth(1)
        .click();

      await test.step('Проверяем модальное окно удаления директории', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          'Удаление директории'
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body div').nth(0)).toHaveText(
          `Директория "${directory.name}" будет удалена`
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-alert-message')).toHaveText(
          'Это действие нельзя отменить.'
        );
      });

      await commonPage.deleteModal.applyBtn.click();
      dirDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем отсутствие директории', async () => {
      await expect(directoriesPage.table.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие удаления директории', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${directory.name}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог удаления директории', async () => {
        const createDirLogInfo: EventLogInfo = {
          event: 'Delete',
          time: dirDeletionDate,
          operObjectType: 'Директория',
          operObjectlink: `/directory/${directory.id}`,
          operObjectName: directory.name,
          operObjectAddress: `${directory.id}`,
          message: '',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });
});
