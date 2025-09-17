import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

/* Created 17.09.2025

1. В поле "Логин" ввести логин существующего пользователя
- Поле заполнено
2. Нажать “Войти”
- Поле заполнено
3. Нажать “Войти”
- Открыта главная страница
4. Нажать кнопку "Выход" в левом нижнем углу экрана"
- Пользователь деавторизован; Открыта страница авторизации */

test('6.5.13. Выход из системы', async ({ page, loginPage, mainPage, commonPage, baseURL }) => {
  await test.step('Авторизуемся под существующим пользователем с неверным паролем', async () => {
    await page.goto('/login');
    await loginPage.authorization(getMainUser());

    await expect(loginPage.loginForm.loader).toBeHidden();
  });
  await test.step('Проверяем авторизацию', async () => {
    await expect(mainPage.pageTitle).toHaveText(`Добрый день, ${getMainUser().username}`);
  });
  await test.step('Выходим из системы', async () => {
    await commonPage.sideMenu.logoutBtn.click();
    await commonPage.sideMenu.logoutConfirmBtn.click();
  });
  await test.step('Проверяем, что вышли наверняка', async () => {
    await page.goto('/directory');
    await expect(commonPage.sideMenu.dirsBtn).toBeHidden();
    await expect(loginPage.loginForm.passwordInput).toBeVisible();
    expect(page.url().split(`${baseURL}`)[1]).toBe('/login');
  });
});
