import dayjs from 'dayjs';
import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

/* Created 17.09.2025
https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13112

1. В поле "Логин" ввести логин существующего пользователя
- Поле заполнено
2. Нажать “Войти”
- Поле заполнено
3. Нажать “Войти”
- Открыта главная страница
4. Нажать кнопку "Выход" в левом нижнем углу экрана"
- Пользователь деавторизован; Открыта страница авторизации */

test('6.5.13. Выход из системы', async ({ page, loginPage, mainPage, commonPage, baseURL }, testInfo) => {
  const mainUser = getMainUser(testInfo.parallelIndex);

  await test.step('Авторизуемся под существующим пользователем с неверным паролем', async () => {
    await page.goto('/login');
    await loginPage.authorization(mainUser);

    await expect(loginPage.loginForm.loader).toBeHidden();
  });
  await test.step('Проверяем авторизацию', async () => {
    const hour = dayjs().hour();
    let helloText = 'Доброе утро';
    if (hour > 11) helloText = 'Добрый день';
    if (hour > 16) helloText = 'Добрый вечер';
    if (hour > 21 || hour < 4) helloText = 'Доброй ночи';
    try {
      await expect(mainPage.pageTitle).toHaveText(`${helloText}, ${mainUser.displayed_name || mainUser.username}`);
    }
    catch (e) {
      throw Error(`Час на момент теста: ${hour}\n ${e}`)
    }

  });
  await test.step('Выходим из системы', async () => {
    await page.waitForTimeout(500);
    await commonPage.sideMenu.logoutBtn.click();
    await commonPage.sideMenu.logoutConfirmBtn.click();
  });
  await test.step('Проверяем, что вышли наверняка', async () => {
    await page.goto('/directory');
    await expect(commonPage.sideMenu.dirsBtn).toBeHidden();
    await expect(loginPage.loginForm.passwordInput).toBeVisible();
    expect.soft(page.url().split(`${baseURL}`)[1]).toContain('/login');
  });
});
