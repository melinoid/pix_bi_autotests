import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

/* Created 16.09.2025
https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13100

1. В поле "Логин" ввести логин существующего пользователя
- Поле ввода активно, данные введены
2. В поле "Пароль" ввести неверный пароль для этого пользователя
- Поле заполнено. Введенные данные скрыты
3. Нажать "Войти"
- Отображается ошибка "Неправильный логин или пароль" */

test('6.5.1. Авторизация существующего пользователя с неверным паролем', async ({
  page,
  loginPage,
  commonPage,
}, testInfo) => {
  const user = { username: getMainUser(testInfo.parallelIndex).username, password: 'boba' };

  await test.step('Авторизуемся под существующим пользователем с неверным паролем', async () => {
    await page.goto('/login');

    await loginPage.loginForm.loginInput.fill(user.username);
    await loginPage.loginForm.passwordInput.fill(user.password);

    await test.step('Проверяем отображение пароля', async () => {
      // type="password" всегда в браузере визуально скрывает пароль
      expect(await loginPage.loginForm.passwordInput.getAttribute('type')).toBe('password');
      await loginPage.loginForm.showPasswordBtn.click();
      expect(await loginPage.loginForm.passwordInput.getAttribute('type')).toBe('text');
      await expect(loginPage.loginForm.passwordInput).toHaveValue(user.password);
      await loginPage.loginForm.hidePasswordBtn.click();
      expect(await loginPage.loginForm.passwordInput.getAttribute('type')).toBe('password');
    });

    await loginPage.loginForm.submitBtn.click();

    await expect(loginPage.loginForm.loader).toBeHidden();
    await page.waitForLoadState('load');
    await expect(commonPage.mainLoader).toBeHidden();

    await expect(loginPage.loginForm.loader).toBeHidden();
  });

  await test.step('Проверяем неудачную авторизацию', async () => {
    // Ожидаем одно единственное уведомление
    await expect(
      page.getByRole('alert').locator('div').filter({ hasText: 'Неправильный логин или пароль' })
    ).toBeInViewport();
    await expect(loginPage.loginForm.loginInput).toBeVisible();
  });
});
