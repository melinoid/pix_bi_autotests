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

  /* Create: 10.11.2025
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

  test('2.1.1. Создание приложения в персональной директории', async ({
    page,
    commonPage,
    directoryPage,
    applicationPage,
    logsPage,
  }) => {
    let application: Application = await ApplicationTD.createApplication();
    let appCreationDate: Dayjs;

    await test.step('Переходим к созданию приложения', async () => {
      await directoryPage.addAppBtn.click();
    });
    await test.step('Заполняем форму приложения', async () => {
      await expect(directoryPage.appModal.modalTitle).toHaveText('Новое приложение');
      await directoryPage.appModal.nameField.input.fill(application.name);
      await directoryPage.appModal.descriptionField.input.fill(`${application.description}`);
      await expect(directoryPage.appModal.previewUpload).toBeVisible();
    });
    await test.step('Создаём приложение', async () => {
      await directoryPage.appModal.createBtn.click();
      appCreationDate = dayjs(); // Временем создания является время отправки запроса
      await page.waitForLoadState('load');
      await expect(directoryPage.appModal.modalTitle).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем созданное приложение', async () => {
      await expect(applicationPage.appName).toHaveText(application.name);
      await expect(applicationPage.dirName).toHaveText(`${application.directory_name} /`);
      await expect(
        page
          .locator(':below(h2):right-of(.ant-layout-sider-light) .ant-collapse')
          .locator('//div[contains(@class, "DashboardInList_dashboard")]')
      ).toHaveCount(0);
    });
    await test.step('Ищем созданное приложение в директории', async () => {
      await applicationPage.dirName.click();
      await expect(page.locator('//div[contains(@class, "ApplicationInList_title")]').last()).toHaveText(
        application.name
      );
      // Вытягиваем ID созданного приложения из ссылки
      await page
        .locator('//div[contains(@class, "ApplicationInList_info")]')
        .locator(`:has-text("${application.name}")`)
        .click();
      // Записываем приложение для дальнейших тестов
      application.id = page.url().split('/application/')[1];
      writeData('application_crud', application);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.sideMenu.adminBtn.click();
        await commonPage.adminLinksMenu.logsLink.click();
        await page.waitForLoadState('load');

        await expect(commonPage.contentLoader).toBeHidden();
      });
      await test.step('Ищем событие создания приложения', async () => {
        await logsPage.table.head.locator('th.ant-table-cell').nth(0).locator('[data-testid*=table-filter]').click();
        await page.getByRole('menuitem', { name: 'Create' }).click();
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await logsPage.table.head.locator('th.ant-table-cell').nth(4).locator('[data-testid*=table-filter]').click();
        await page.locator('input[data-testid*=table-search-input]').last().fill(`${application.name}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });

        await expect(logsPage.table.body.locator('tr.ant-table-row')).toHaveCount(1);
      });
      await test.step('Проверяем лог создания приложения', async () => {
        const createDirLogInfo: EventLogInfo = {
          event: 'Create',
          time: appCreationDate,
          operObjectType: 'Приложение',
          operObjectlink: `/application/${application.id}`,
          operObjectName: application.name,
          operObjectAddress: `${application.id}`,
          message: 'Application was created',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });

  /* Create: 10.11.2025
  Тест-кейс на проверку редактирования приложенияв директории отсутствует */

  test('Редактирование приложения', async ({ page, commonPage, directoryPage, applicationPage, logsPage, data }) => {
    const oldApplication = data.application_crud;
    const newApplication = await ApplicationTD.createApplication();
    let appModificationDate: Dayjs;

    await test.step('Ищем подходящую директорию', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await directoryPage.searchInput.fill(oldApplication.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(
        page.locator(
          '//div[contains(@class, "DirectoryPage_MainContent")] //div[contains(@class, "ApplicationInList_application")]'
        )
      ).toHaveCount(1);
    });
    await test.step('Переходим к редактированию приложения', async () => {
      await expect(page.locator('//div[contains(@class, "ApplicationInList_title")]')).toHaveText(oldApplication.name);
      await page.locator('//div[contains(@class, "ApplicationInList_info")]').locator('button').click();
      await page.locator('.ant-popover ul li[data-menu-id*=update]').click();
    });
    await test.step('Заполняем форму приложения', async () => {
      await expect(directoryPage.appModal.modalTitle).toHaveText('Редактирование приложения');
      await directoryPage.appModal.nameField.input.clear();
      await directoryPage.appModal.nameField.input.fill(newApplication.name);
      await directoryPage.appModal.descriptionField.input.clear();
      await directoryPage.appModal.descriptionField.input.fill(newApplication.description || 'Description undefined');
      await expect(directoryPage.appModal.previewUpload).toBeVisible();
    });
    await test.step('Сохраняем изменения приложения', async () => {
      await directoryPage.appModal.createBtn.click();
      appModificationDate = dayjs(); // Временем создания является время отправки запроса
      await page.waitForLoadState('load');
    });
    await test.step('Ищем изменённое приложение в директории', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await directoryPage.searchInput.fill(newApplication.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(
        page.locator(
          '//div[contains(@class, "DirectoryPage_MainContent")] //div[contains(@class, "ApplicationInList_application")]'
        )
      ).toHaveCount(1);

      newApplication.id = oldApplication.id;
      rewriteData('application_crud', newApplication);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.sideMenu.adminBtn.click();
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
          operObjectlink: `/application/${oldApplication.id}`,
          operObjectName: newApplication.name,
          operObjectAddress: `${newApplication.id}`,
          message: 'Application was edited',
        };
        await logsPage.checkEventLogs(0, createDirLogInfo);
      });
    });
  });

  /* Create: 10.11.2025
  https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?folderId=2653&selected=12924

      1. Открыть персональную директорию
      2. Нажать на иконку с тремя точками у созданного приложения
      3. Выбрать “Удалить”
      - Отображается окно подтверждения удаления приложения
      4. В окне "Удаление приложения" нажать "Точно удалить"
      - Отображается уведомление
      - Приложение удалено из директории
      5. Открыть раздел “Администрирование”
      6. Перейти в подраздел “Журнал событий”
      - Открыт “Журнал событий”
      7. Проверить событие “Delete” для типа объекта “Приложение”
      - В новой записи, в колонке “Объект операции” указано удаленное приложение
      - В колонке “Имя пользователя” указан пользователь, под которым выполняется проверка
      8. Проверить ссылки на ресурсы в полях “Объект операции” и “Пользователь”
      - Ссылки кликабельны
      - Ссылки ведут на корректные ресурсы */

  test('2.1.5. Удаление приложения через раздел "Директории"', async ({
    page,
    commonPage,
    directoryPage,
    logsPage,
    data,
  }) => {
    const application: Application = data.application_crud;
    let appDeletionDate: Dayjs;

    await test.step('Ищем созданное приложение', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await directoryPage.searchInput.fill(application.name);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(
        page.locator(
          '//div[contains(@class, "DirectoryPage_MainContent")] //div[contains(@class, "ApplicationInList_application")]'
        )
      ).toHaveCount(1);
    });
    await test.step('Удаляем приложение', async () => {
      await expect(page.locator('//div[contains(@class, "ApplicationInList_title")]')).toHaveText(application.name);
      await page.locator('//div[contains(@class, "ApplicationInList_info")]').locator('button').click();
      await page.locator('.ant-popover ul li[data-menu-id*=delete]').click();

      await test.step('Проверяем модальное окно удаления приложения', async () => {
        await expect(page.locator('.ant-modal-content .ant-modal-header .ant-modal-title')).toHaveText(
          'Удаление приложения'
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body div').nth(0)).toHaveText(
          `Вы уверены что хотите удалить Приложение '${application.name}' и все его Дашборды (0 штук)?`
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-alert-message')).toHaveText(
          'Это действие нельзя отменить.'
        );
        await expect(page.locator('.ant-modal-content .ant-modal-body .ant-checkbox-wrapper')).toHaveText(
          'Не спрашивать в следующий раз'
        );
      });

      await commonPage.deleteModal.applyBtn.click();
      appDeletionDate = dayjs();
      await expect(commonPage.contentLoader).toBeHidden({ timeout: 10000 });
    });
    await test.step('Проверяем отсутствие приложения', async () => {
      await expect(
        page.locator(
          '//div[contains(@class, "DirectoryPage_MainContent")] //div[contains(@class, "ApplicationInList_application")]'
        )
      ).toHaveCount(0);
    });

    await test.step('Проверяем логи в журнале событий', async () => {
      await test.step('Переходим в "События"', async () => {
        await commonPage.sideMenu.adminBtn.click();
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
