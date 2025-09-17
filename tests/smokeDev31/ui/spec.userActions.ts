import { getMainUser } from '../../../utils/config';
import { test } from '../../../utils/fixtures';
import { expect } from '@playwright/test';

test.describe('Действия с пользователем', async () => {
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

  test('6.1.1. Создание пользователя', async ({ page, commonPage, usersPage, data }) => {
    await test.step('Переходим к созданию пользователя', async () => {
      await usersPage.createUserBtn.click();
    });
    await test.step('Заполняем форму пользователя', async () => {
      await usersPage.newUserPage.usernameField.input.fill(data.user_uno.username);
      await usersPage.newUserPage.displayedNameField.input.fill(data.user_uno.displayed_name);
      await usersPage.newUserPage.emailField.input.fill(data.user_uno.email);
      await usersPage.newUserPage.passwordField.input.fill(data.user_uno.password);
      await usersPage.newUserPage.repeatPasswordField.input.fill(data.user_uno.password);
    });
    await test.step('Создаём пользователя', async () => {
      await usersPage.newUserPage.createBtn.click();
      await expect(usersPage.newUserPage.actionAlert).toBeInViewport({ timeout: 10000 });
      await page.waitForLoadState('load');
      await expect(usersPage.usersTable.head).toBeVisible();
    });
    await test.step('Проверяем созданного пользователя', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(data.user_uno.username);
      await page.waitForTimeout(2000);
      await expect(commonPage.contentLoader).toBeHidden();

      await expect(usersPage.usersTable.body.locator('tr.ant-table-row')).toHaveCount(1);
      await expect(usersPage.usersTable.body.locator('tr.ant-table-row').nth(0).locator('td').nth(1)).toHaveText(
        data.user_uno.username
      );
      await expect(usersPage.usersTable.body.locator('tr.ant-table-row').nth(0).locator('td').nth(2)).toHaveText(
        data.user_uno.displayed_name
      );
      await expect(usersPage.usersTable.body.locator('tr.ant-table-row').nth(0).locator('td').nth(3)).toHaveText(
        data.user_uno.email
      );
    });
  });

  test('6.1.3. Удаление пользователя', async ({ page, commonPage, usersPage, data }) => {
    await test.step('Ищем созданного пользователя', async () => {
      await expect(commonPage.contentLoader).toBeHidden();
      await commonPage.searchField.openBtn.click();
      await commonPage.searchField.input.fill(data.user_uno.username);
      await page.waitForTimeout(2000);
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Удаляем пользователя', async () => {
      await page.locator('tr.ant-table-row').nth(0).locator('td').last().locator('[data-testid*=delete]').click();
      await usersPage.deleteModal.applyBtn.click();
      await expect(commonPage.contentLoader).toBeHidden();
    });
    await test.step('Проверяем итсутствие пользователя', async () => {
      await expect(usersPage.usersTable.body.locator('.ant-table-expanded-row-fixed .ant-empty')).toBeVisible();
    });
  });
});
