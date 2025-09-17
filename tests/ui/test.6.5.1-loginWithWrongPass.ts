import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

/* Created 16.09.2025

  1. В поле "Логин" ввести логин существующего пользователя
  - Поле ввода активно, данные введены
  2. В поле "Пароль" ввести неверный пароль для этого пользователя
  - Поле заполнено. Введенные данные скрыты
  3. Нажать "Войти"
  - Отображается ошибка "Неправильный логин или пароль" */

test('6.5.1. Авторизация существующего пользователя с неверным паролем', async ({ page, loginPage }) => {
  await test.step('Авторизуемся под существующим пользователем с неверным паролем', async () => {
    await page.goto('/login');
    await loginPage.authorization({ username: getMainUser().username, password: 'boba' });

    await test.step('Проверяем отображение пароля', async () => {
      // type="password" всегда в браузере визуально скрывает пароль
      expect(await loginPage.loginForm.passwordInput.getAttribute('type')).toBe('password');
      await loginPage.loginForm.showPasswordBtn.click();
      expect(await loginPage.loginForm.passwordInput.getAttribute('type')).toBe('text');
      await loginPage.loginForm.hidePasswordBtn.click();
      expect(await loginPage.loginForm.passwordInput.getAttribute('type')).toBe('password');
    });

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
