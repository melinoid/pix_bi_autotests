import { Directory } from '../../data/data';
import { rewriteData } from '../../data/data.common';
import { EventLogInfo } from '../../pages/adminPages/page.logs';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

import dayjs, { Dayjs } from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

test.describe.serial('Действия с приложениями в персональной директории', async () => {
  test.beforeEach(async ({ page, loginPage, commonPage }) => {
    await test.step('Авторизуемся', async () => {
      await loginPage.goToAuthorizedPage('/login', getMainUser());
    });
    await test.step('Переходим в раздел "Директории"', async () => {
      await commonPage.sideMenu.dirsBtn.click();
      await page.waitForLoadState('load');
      await expect(commonPage.mainLoader).toBeHidden();
      await expect(commonPage.contentLoader).toBeHidden();
    });
  });

  /* Create: 07.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?folderId=2653&selected=12920

  1. Нажать “Добавить приложение”
  – Открыто окно "Новое приложение”
  2. Заполнить поле “Название”
  - Нажать "Добавить"
  - Приложение создано
  - Открыта страница приложения
  3. Открыть раздел “Администрирование”
  4. Перейти в подраздел “Журнал событий”
  - Открыт “Журнал событий”
  5. Проверить событие “Create” для типа объекта “Приложение”
  - В новой записи, в колонке “Объект операции” указано созданное приложение
  – В колонке “Имя пользователя” указан пользователь, под которым выполняется проверка
  6. Проверить ссылки на ресурсы в полях “Объект операции” и “Пользователь”
  – Ссылки кликабельны
  – Ссылки ведут на корректные ресурсы */

  test.skip('2.1.1. Создание приложения в персональной директории', async ({
    page,
    commonPage,
    directoriesPage,
    logsPage,
    data,
  }) => {
    let directory: Directory = data.directory_uno;
    let dirCreationDate: Dayjs;

    await test.step('Переходим к созданию приложения', async () => {
      await directoriesPage.createDirBtn.click();
    });
    //   await test.step('Заполняем форму директории', async () => {
    //     await directoriesPage.dirPage.nameField.input.fill(directory.name);
    //     await directoriesPage.dirPage.descriptionField.input.fill(`${directory.description}`);
    //   });
    //   await test.step('Создаём директорию', async () => {
    //     await directoriesPage.createDirModal.createBtn.click();
    //     dirCreationDate = dayjs(); // Временем создания является время отправки запроса
    //     await page.waitForLoadState('load');
    //   });
    //   await test.step('Ищем созданную директорию', async () => {
    //     await expect(commonPage.contentLoader).toBeHidden();
    //     await commonPage.searchField.openBtn.click();
    //     await commonPage.searchField.input.fill(directory.name);
    //     await expect(commonPage.contentLoader).toBeHidden();

    //     await expect(directoriesPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    //   });
    //   await test.step('Проверяем созданную директорию', async () => {
    //     const directoryRow = directoriesPage.table.body.locator('tr.ant-table-row').nth(0).locator('td');
    //     // Название
    //     await expect(directoryRow.nth(1)).toHaveText(directory.name);
    //     // Описание
    //     await expect(directoryRow.nth(2)).toHaveText(`${directory.description}`);
    //     // Автор
    //     await expect(directoryRow.nth(3)).toHaveText(getMainUser().username);
    //     // Количество приложений
    //     await expect(directoryRow.nth(4)).toHaveText('0');
    //     // Создана
    //     await expect(directoryRow.nth(5)).toHaveText(dirCreationDate.format('DD.MM.YYYY'));
    //     // Изменена
    //     await expect(directoryRow.nth(6)).toBeEmpty();
    //     // Элементы управления
    //     await expect(directoryRow.locator('button').nth(0)).toBeVisible();
    //     await expect(directoryRow.locator('button').nth(1)).toBeVisible();

    //     // Вытягиваем ID созданной директории из ссылки
    //     await directoryRow.locator('button').nth(0).click();
    //     directory.id = page.url().split('/directories/')[1];
    //     // Записываем id директории для дальнейших тестов
    //     directory.metadata = { created_at: dirCreationDate.format('DD.MM.YYYY HH:mm:ss') };
    //     rewriteData('directory_uno', directory);
    //   });

    //   await test.step('Проверяем логи в журнале событий', async () => {
    //     await test.step('Переходим в "События информационной безопасности"', async () => {
    //       await commonPage.adminLinksMenu.logsLink.click();
    //       await page.waitForLoadState('load');

    //       await expect(commonPage.contentLoader).toBeHidden();
    //     });
    //     await test.step('Ищем событие создания директории', async () => {
    //       await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
    //       await page.getByRole('menuitem', { name: 'Create' }).click();
    //       await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

    //       await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
    //       await page.locator('input[data-testid*=table-search-input]').last().fill(`${directory.name}`);
    //       await page.keyboard.press('Enter');
    //       await page.waitForTimeout(2000);
    //       await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

    //       await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
    //     });
    //     await test.step('Проверяем лог создания директории', async () => {
    //       const createDirLogInfo: EventLogInfo = {
    //         event: 'Create',
    //         time: dirCreationDate,
    //         operObjectType: 'Директория',
    //         operObjectlink: `/directory/${directory.id}`,
    //         operObjectName: directory.name,
    //         operObjectAddress: `${directory.id}`,
    //         message: 'Directory was created',
    //       };
    //       await logsPage.checkEventLogs(0, createDirLogInfo);
    //     });
    //   });
  });
});
